'use server';

import { BASE_PRICE, PRODUCT_PRICES } from '@/config/products';
import { env } from '@/data/env/client';
import { Order } from '@/db/generated/prisma';
import { db } from '@/db/prisma';
import { stripe } from '@/lib/stripe';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export async function createCheckoutSession({ configId }: { configId: string }) {
  const configuration = await db.configuration.findUnique({ where: { id: configId } });

  if (configuration == null) throw new Error('Configuration not found');

  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (user == null) throw new Error('You need to be logged in to make a purchase');

  const { finish, material } = configuration;

  let price = BASE_PRICE;
  if (finish === 'textured') price += PRODUCT_PRICES.finish.textured;
  if (material === 'polycarbonate') price += PRODUCT_PRICES.material.polycarbonate;

  let order: Order | undefined = undefined;

  const existingOrder = await db.order.findFirst({
    where: { userId: user.id, configurationId: configuration.id },
  });

  if (existingOrder) {
    order = existingOrder;
  } else {
    order = await db.order.create({
      data: { amount: price / 100, userId: user.id, configurationId: configuration.id },
    });
  }

  const product = await stripe.products.create({
    name: 'Custom iPhone Case',
    images: [configuration.imgUrl],
    default_price_data: {
      currency: 'USD',
      unit_amount: price,
    },
  });

  const stripeSession = await stripe.checkout.sessions.create({
    success_url: `${env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
    cancel_url: `${env.NEXT_PUBLIC_SERVER_URL}/configure/preview?id=${configuration.id}`,
    payment_method_types: ['card', 'paypal'],
    mode: 'payment',
    shipping_address_collection: { allowed_countries: ['DE', 'US'] },
    metadata: {
      userId: user.id,
      orderId: order.id,
    },
    line_items: [{ price: product.default_price as string, quantity: 1 }],
  });

  return { url: stripeSession.url };
}
