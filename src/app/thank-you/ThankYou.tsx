import PhonePreview from '@/components/PhonePreview';
import { buttonVariants } from '@/components/ui/button';
import { db } from '@/db/prisma';
import { formatPrice, retry } from '@/lib/utils';
import { Prisma } from 'generated/prisma/client';
import Link from 'next/link';

async function ThankYou({ orderId, userId }: { orderId: string; userId: string }) {
  const data = await getOrderRetry({ id: orderId, userId });

  if (!data.success) {
    return (
      <div className="flex-1 flex items-center justify-center py-6 text-center">
        <div>
          <h3 className="font-semibold text-xl text-red-400 mb-2">{data.message}</h3>
          <Link href="/" className={buttonVariants({ variant: 'outline' })}>Home Page</Link>
        </div>
      </div>
    );
  }

  const { configuration, billingAddress, shippingAddress, amount } = data.data;
  const { color } = configuration;

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-xl">
          <h1 className="text-base font-medium text-primary">Thank you!</h1>
          <p className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            You case is on the way!
          </p>
          <p className="mt-2 text-base text-zinc-500">
            We've received your order and are now processing it.
          </p>
          <div className="mt-12 text-sm font-medium">
            <p className="text-zinc-900">Order number</p>
            <p className="mt-2 text-zinc-500">{orderId}</p>
          </div>
        </div>

        <div className="mt-10 border-t border-zinc-200">
          <div className="mt-10 flex flex-auto flex-col">
            <h4 className="font-semibold text-zinc-900">You made a great choice!</h4>
            <p className="mt-2 text-sm text-zinc-600">
              We at CaseCobra believe that a phone case doesn't only need to look good, but also
              last you for the years to come. We offer a 5-year print guarantee: If your case isn't
              of the highest quality, we'll replace it for free
            </p>
          </div>
        </div>

        <div className="flex space-x-6 overflow-hidden mt-4 rounded-xl bg-gray-900/5 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl">
          <PhonePreview croppedImageUrl={configuration.croppedImageUrl!} color={color!} />
        </div>
        <div>
          <div className="grid grid-cols-2 gap-x-6 py-10 text-sm">
            <div>
              <p className="font-medium text-gray-900">Shipping address</p>
              <div className="mt-2 text-zinc-700">
                <address className="not-italic">
                  <span className="block">{shippingAddress?.name}</span>
                  <span className="block">{shippingAddress?.street}</span>
                  <span className="block">
                    {shippingAddress?.postalCode} {shippingAddress?.city}
                  </span>
                </address>
              </div>
            </div>
            <div>
              <p className="font-medium text-gray-900">Billing address</p>
              <div className="mt-2 text-zinc-700">
                <address className="not-italic">
                  <span className="block">{billingAddress?.name}</span>
                  <span className="block">{billingAddress?.street}</span>
                  <span className="block">{billingAddress?.postalCode} {billingAddress?.city}</span>
                </address>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 border-t border-zinc-200 py-10 text-sm">
            <div>
              <p className="font-medium text-zinc-900">Payment status</p>
              <p className="mt-2 text-zinc-700">Paid</p>
            </div>

            <div>
              <p className="font-medium text-zinc-900">Shipping method</p>
              <p className="mt-2 text-zinc-700">Delivery via UPS takes up to 3 working days</p>
            </div>
          </div>
        </div>

        <div className="space-y-6 border-t border-zinc-200 pt-10 text-sm">
          <div className="flex justify-between">
            <p className="font-medium text-zinc-900">Subtotal</p>
            <p className="text-zinc-700">{formatPrice(amount)}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-medium text-zinc-900">Shipping</p>
            <p className="text-zinc-700">{formatPrice(0)}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-medium text-zinc-900">Total</p>
            <p className="text-zinc-700">{formatPrice(amount)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ThankYou;

type GetOrderRetry = { success: true; data: OrderWithRelations } | {
  success: false;
  message: string;
};

type OrderWithRelations = Prisma.OrderGetPayload<{
  include: {
    configuration: true;
    billingAddress: true;
    shippingAddress: true;
    user: true;
  };
}>;

async function getOrderRetry(
  { id, userId }: { id: string; userId: string }
): Promise<GetOrderRetry> {
  try {
    return retry(async () => {
      const order = await getOrder({ userId, id });
      if (order == null) {
        return { success: false, message: 'This order does not exist' };
      }

      if (!order.isPaid) throw new Error();

      return { success: true, data: order };
    }, { retries: 10, delay: 500 });
  } catch {
    return { success: false, message: 'Unable to verify your payment' };
  }
}

async function getOrder({ id, userId }: { id: string; userId: string }) {
  const order = await db.order.findFirst({
    where: { id, userId },
    include: {
      configuration: true,
      billingAddress: true,
      shippingAddress: true,
      user: true,
    },
  });

  return order;
}
