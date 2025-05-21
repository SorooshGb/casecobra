import OrderReceivedEmail from '@/components/emails/OrderReceivedEmail';
import { env } from '@/data/env/server';
import { db } from '@/db/prisma';
import { stripe } from '@/services/stripe/stripe';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import Stripe from 'stripe';

const resend = new Resend(env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const event = stripe.webhooks.constructEvent(
      await req.text(),
      req.headers.get('stripe-signature') as string,
      env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === 'checkout.session.completed') {
      if (!event.data.object.customer_details?.email) {
        throw new Error('Missing user email');
      }

      const session = event.data.object as Stripe.Checkout.Session;

      const userId = session.metadata?.userId;
      const orderId = session.metadata?.orderId;

      if (!userId || !orderId) throw new Error('Missing metadata');

      const billingAddress = session.customer_details?.address;
      const shippingAddress = session.collected_information?.shipping_details?.address;

      const updatedOrder = await db.order.update({
        where: { id: orderId },
        data: {
          isPaid: true,
          shippingAddress: {
            create: {
              name: session.customer_details?.name || '',
              city: shippingAddress?.city || '',
              country: shippingAddress?.country || '',
              postalCode: shippingAddress?.postal_code || '',
              street: shippingAddress?.line1 || '',
              state: shippingAddress?.state,
            },
          },
          billingAddress: {
            create: {
              name: session.customer_details?.name || '',
              city: billingAddress?.city || '',
              country: billingAddress?.country || '',
              postalCode: billingAddress?.postal_code || '',
              street: billingAddress?.line1 || '',
              state: billingAddress?.state || '',
            },
          },
        },
      });

      await resend.emails.send({
        from: 'CaseCobra <onboarding@resend.dev>',
        to: [event.data.object.customer_details.email],
        subject: 'Thanks for your order!',
        react: OrderReceivedEmail({
          orderId,
          orderDate: updatedOrder.createdAt.toLocaleDateString(),
          shippingAddress: {
            name: session.customer_details?.name || '',
            city: shippingAddress?.city || '',
            country: shippingAddress?.country || '',
            postalCode: shippingAddress?.postal_code || '',
            street: shippingAddress?.line1 || '',
            state: shippingAddress?.state || '',
          },
        }),
      });
    }

    return NextResponse.json({ result: event, ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Something went wrong', ok: false }, { status: 500 });
  }
}
