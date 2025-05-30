'use client';

import { LoginLink, RegisterLink } from '@kinde-oss/kinde-auth-nextjs';
import Image from 'next/image';
import type { Dispatch, SetStateAction } from 'react';
import { buttonVariants } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';

function LoginModal(
  { isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: Dispatch<SetStateAction<boolean>> }
) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <div className="relative size-24 mx-auto mb-2">
            <Image
              src="/snake-1.png"
              alt="snake image"
              className="object-contain"
              fill
            />
          </div>
          <DialogTitle className="text-3xl text-center font-bold tracking-tight text-gray-900">
            Log in to continue
          </DialogTitle>
          <DialogDescription className="text-base text-center py-2">
            <span className="font-medium text-zinc-900">Your configuration was saved!</span>{'  '}
            Please login or create an account to complete your purchase.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6">
          <LoginLink className={buttonVariants({ variant: 'outline' })}>Login</LoginLink>
          <RegisterLink className={buttonVariants({ variant: 'default' })}>Sign up</RegisterLink>
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default LoginModal;
