import { env } from '@/data/env/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from './ui/button';
import Wrapper from './Wrapper';

async function Navbar() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const isAdmin = user?.email === env.ADMIN_EMAIL;

  return (
    <nav className="sticky inset-x-0 top-0 z-[100] bg-white/75 backdrop-blur-lg border-b border-gray-200 transition-all">
      <Wrapper>
        <div className="flex h-14 items-center justify-between border-b border-zin-200">
          <Link href="/" className="flex text-lg z-40 font-semibold">
            case<span className="text-green-600">cobra</span>
          </Link>

          <div className="h-full flex items-center space-x-4">
            {user
              ? (
                <>
                  <Link
                    href="/api/auth/logout"
                    className={buttonVariants({ size: 'sm', variant: 'ghost' })}
                  >
                    Sign out
                  </Link>
                  {isAdmin
                    ? (
                      <Link
                        href="/dashboard"
                        className={buttonVariants({ size: 'sm', variant: 'ghost' })}
                      >
                        Dashboard ✨
                      </Link>
                    )
                    : null}
                  <Link
                    href="/configure/upload"
                    className={buttonVariants({
                      size: 'sm',
                      className: 'hidden sm:flex items-center gap-1',
                    })}
                  >
                    Create case
                    <ArrowRight className="ml-1.5 size-5" />
                  </Link>
                </>
              )
              : (
                <>
                  <Link
                    href="api/auth/register"
                    className={buttonVariants({ size: 'sm', variant: 'ghost' })}
                  >
                    Sign up
                  </Link>
                  <Link
                    href="/api/auth/login"
                    className={buttonVariants({
                      size: 'sm',
                      variant: 'ghost',
                    })}
                  >
                    Login
                  </Link>

                  <div className="h-8 w-px bg-zinc-200 hidden sm:block" />

                  <Link
                    href="/configure/upload"
                    className={buttonVariants({
                      size: 'sm',
                      className: 'hidden sm:flex items-center gap-1',
                    })}
                  >
                    Create case
                    <ArrowRight className="ml-1.5 size-5" />
                  </Link>
                </>
              )}
          </div>
        </div>
      </Wrapper>
    </nav>
  );
}
export default Navbar;
