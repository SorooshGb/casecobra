'use client';

import useServerAction from '@/hooks/useServerAction';
import { Loader2 } from 'lucide-react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getAuthStatus } from './actions';

function redirectAfterAuth(success: boolean, router: AppRouterInstance) {
  const configId = localStorage.getItem('configurationId');
  const target = configId ? `/configure/preview?id=${configId}` : '/';
  localStorage.removeItem('configurationId');

  if (success) {
    router.push(target);
    return null;
  }

  return setTimeout(() => router.push(target), 2000);
}

function AuthCallbackPage() {
  const [data] = useServerAction(getAuthStatus);
  const router = useRouter();

  useEffect(() => {
    if (!data) return;

    const timeout = redirectAfterAuth(data.success, router);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [router, data]);

  return (
    <div className="flex justify-center items-center flex-1">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="size-8 animate-spin text-zinc-500" />
        {(data && !data.success)
          ? <h3 className="font-semibold text-xl text-red-500">{data?.message}</h3>
          : <h3 className="font-semibold text-xl">Logging you in...</h3>}
        <p>You will be redirected automatically</p>
      </div>
    </div>
  );
}
export default AuthCallbackPage;
