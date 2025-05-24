'use server';

import { db } from '@/db/prisma';
import { retry } from '@/lib/utils';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

type AuthCallbackResponse = { success: true } | { success: false; message: string };

export async function getAuthStatus(): Promise<AuthCallbackResponse> {
  try {
    const kindeUser = await retry(fetchVerifiedKindeUser, { retries: 10, delay: 500 });
    if (!kindeUser.email) throw new Error('Invalid user data');

    const existingUser = await db.user.findFirst({ where: { id: kindeUser.id } });

    if (existingUser == null) {
      await db.user.create({ data: { id: kindeUser.id, email: kindeUser.email } });
    }

    return { success: true };
  } catch {
    return { success: false, message: 'Something went wrong with login' };
  }
}

async function fetchVerifiedKindeUser() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user?.id || !user?.email) {
    throw new Error('User not ready');
  }
  return user;
}
