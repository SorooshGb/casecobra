'use server';

import { env } from '@/data/env/client';
import { db } from '@/db/prisma';
import { stripe } from '@/services/stripe/stripe';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { Order } from 'generated/prisma';
import { getTotalCasePrice } from './utils';

export async function createCheckoutSession(
  { configId }: { configId: string }
): Promise<{ success: true; url: string } | { success: false; message: string }> {
  try {
    const configuration = await db.configuration.findUnique({ where: { id: configId } });
    if (configuration == null) return { success: false, message: 'Configuration not found' };

    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (user == null) {
      return { success: false, message: 'You need to be logged in to make a purchase' };
    }

    const { finish, material, imgUrl } = configuration;

    const price = getTotalCasePrice(finish, material);

    const { id: userId } = user;

    const order = await insertOrder({ userId, configId, price });

    const url = await createStripeCheckoutSession({
      imgUrl,
      price,
      orderId: order.id,
      configId,
      userId,
    });

    return { success: true, url };
  } catch {
    return { success: false, message: 'There was an error creating your order' };
  }
}

async function insertOrder(
  { userId, configId, price }: { userId: string; configId: string; price: number }
) {
  let order: Order;

  const existingOrder = await db.order.findFirst({
    where: { userId, configurationId: configId },
  });

  if (existingOrder) {
    order = existingOrder;
  } else {
    order = await db.order.create({
      data: { amount: price / 100, userId, configurationId: configId },
    });
  }

  return order;
}
async function createStripeCheckoutSession({ imgUrl, price, orderId, configId, userId }: {
  imgUrl: string;
  price: number;
  orderId: string;
  configId: string;
  userId: string;
}) {
  const product = await stripe.products.create({
    name: 'Custom iPhone Case',
    images: [imgUrl],
    default_price_data: {
      currency: 'USD',
      unit_amount: price,
    },
  });

  const stripeSession = await stripe.checkout.sessions.create({
    success_url: `${env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${orderId}`,
    cancel_url: `${env.NEXT_PUBLIC_SERVER_URL}/configure/preview?id=${configId}`,
    payment_method_types: ['card', 'paypal'],
    mode: 'payment',
    shipping_address_collection: { allowed_countries: ['DE', 'US'] },
    metadata: {
      userId,
      orderId,
    },
    line_items: [{ price: product.default_price as string, quantity: 1 }],
  });

  if (stripeSession.url == null) throw new Error();

  return stripeSession.url;
}
