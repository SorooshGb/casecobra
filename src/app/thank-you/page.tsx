import { SearchParams } from '@/lib/types/general';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { Loader2 } from 'lucide-react';
import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';
import ThankYou from './ThankYou';

async function ThankYouPage({ searchParams }: { searchParams: SearchParams }) {
  const { orderId } = searchParams;
  if (!orderId || typeof orderId !== 'string') return notFound();

  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user || !user.id || !user.email) redirect('/api/auth/login');

  return (
    <Suspense fallback={<SuspenseFallback />}>
      <ThankYou orderId={orderId} userId={user.id} />;
    </Suspense>
  );
}
export default ThankYouPage;

function SuspenseFallback() {
  return (
    <div className="flex-1 flex items-center justify-center py-6">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="size-8 animate-spin text-zinc-500" />
        <h3 className="font-semibold text-xl">Verifying your payment...</h3>
        <p>This might take a moment.</p>
      </div>
    </div>
  );
}
