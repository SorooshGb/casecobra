'use server';

import { db } from '@/db/prisma';
import { OrderStatus } from 'generated/prisma';

export async function updateOrderStatus({ id, newStatus }: { id: string; newStatus: OrderStatus }) {
  try {
    await db.order.update({
      where: { id },
      data: {
        status: newStatus,
      },
    });
    return { success: true };
  } catch {
    return { success: false, message: 'There was an error updating status' };
  }
}
