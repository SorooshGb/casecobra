'use server';

import { OrderStatus } from 'generated/prisma';
import { db } from '@/db/prisma';

export async function changeOrderStatus({ id, newStatus }: { id: string; newStatus: OrderStatus }) {
  await db.order.update({
    where: { id },
    data: {
      status: newStatus,
    },
  });
}
