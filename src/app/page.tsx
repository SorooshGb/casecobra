/* eslint-disable @next/next/no-img-element */
import { Icons } from '@/components/Icons';
import Phone from '@/components/Phone';
import Reviews from '@/components/Reviews';
import { buttonVariants } from '@/components/ui/button';
import Wrapper from '@/components/Wrapper';
import { ArrowRight, Check, Star } from 'lucide-react';
import Link from 'next/link';
import { ReactNode } from 'react';

export default function Home() {
  return (
    <div className="bg-slate-50">
      <section>
        <Wrapper className="pb-24 pt-10 lg:grid lg:grid-cols-3 sm:pb-32 lg:gap-x-0 xl:gap-x-8 lg:pt-24 xl:pt-32 lg:pb-52">
          <div className="col-span-2 px-6 lg:px-0 lg:pt-4">
            <div className="relative mx-auto text-center lg:text-left flex flex-col items-center lg:items-start">
              <div className="absolute w-28 left-0 -top-20 hidden lg:block">
                <img src="/snake-1.png" className="w-full" alt="logo image" />
              </div>
              <h1 className="relative w-fit tracking-tight text-balance mt-16 font-bold !leading-tight text-gray-900 text-5xl md:text-6xl lg:text-7xl">
                Your Image on a <span className="bg-green-600 px-2 text-white">Custom</span>{' '}
                Phone Case
              </h1>
              <p className="mt-8 text-lg lg:pr-10 max-w-prose text-center lg:text-left text-balance md:text-wrap">
                Capture your favorite memories with your own,{' '}
                <span className="font-semibold">one-of-one</span>{' '}
                phone case. CaseCobra allows you to protect your memories, not just your phone case.
              </p>
              <ul className="mt-8 space-y-2 text-left font-medium flex flex-col items-center sm:items-start">
                <div className="space-y-2">
                  <li className="flex gap-1.5 items-center text-left">
                    <Check className="size-5 shrink-0 text-green-600" />
                    Hight-quality, durable material
                  </li>
                  <li className="flex gap-1.5 items-center text-left">
                    <Check className="size-5 shrink-0 text-green-600" />
                    5 year print guarantee
                  </li>
                  <li className="flex gap-1.5 items-center text-left">
                    <Check className="size-5 shrink-0 text-green-600" />
                    Modern iPhone models supported
                  </li>
                </div>
              </ul>
              <div className="mt-12 flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <div className="flex -space-x-4">
                  <img
                    className="inline-block size-10 rounded-full ring-2 ring-slate-100"
                    src="/users/user-1.png"
                    alt="user image"
                  />
                  <img
                    className="inline-block size-10 rounded-full ring-2 ring-slate-100"
                    src="/users/user-2.png"
                    alt="user image"
                  />
                  <img
                    className="inline-block size-10 rounded-full ring-2 ring-slate-100"
                    src="/users/user-3.png"
                    alt="user image"
                  />
                  <img
                    className="inline-block size-10 rounded-full ring-2 ring-slate-100"
                    src="/users/user-4.jpg"
                    alt="user image"
                  />
                  <img
                    className="inline-block size-10 rounded-full ring-2 ring-slate-100 object-cover"
                    src="/users/user-5.jpg"
                    alt="user image"
                  />
                </div>

                <div className="flex flex-col justify-between items-center sm:items-start">
                  <div className="flex gap-0.5">
                    <Star className="size-4 text-green-600 fill-green-600" />
                    <Star className="size-4 text-green-600 fill-green-600" />
                    <Star className="size-4 text-green-600 fill-green-600" />
                    <Star className="size-4 text-green-600 fill-green-600" />
                    <Star className="size-4 text-green-600 fill-green-600" />
                  </div>

                  <p>
                    <span className="font-semibold">1.250</span> happy customers
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-full lg:col-span-1 w-full flex justify-center px-8 sm:px-16 md:px-0 mt-32 lg:mx-0 lg:mt-20 h-fit">
            <div className="relative md:max-w-xl">
              <img
                src="/your-image.png"
                className="absolute w-40 lg:w-52 left-56 -top-20 select-none hidden sm:block lg:hidden xl:block"
              />
              <img
                src="/line.png"
                className="absolute w-20 -left-6 -bottom-6 select-none"
              />
              <Phone className="w-64" imgSrc="/testimonials/1.jpg" />
            </div>
          </div>
        </Wrapper>
      </section>

      {/* Value Proposition Section */}
      <section className="bg-slate-100 py-24">
        <Wrapper className="flex flex-col items-center gap-16 sm:gap-32">
          <div className="flex flex-col lg:flex-row items-center gap-4 sm:gap-6">
            <h2 className="order-1 mt-2 tracking-tight text-center text-balance !leading-tight font-bold text-5xl md:text-6xl text-gray-900">
              What our{' '}
              <span className="relative px-2">
                customers{' '}
                <Icons.underline className="hidden sm:block pointer-events-none absolute inset-x-0 -bottom-6 text-green-500" />
              </span>{' '}
              say
            </h2>
            <img src="/snake-2.png" className="w-24 order-0 lg:order-2" />
          </div>

          <div className="mx-auto grid max-w-2xl grid-cols-1 px-4 lg:mx-0 lg:max-w-none lg:grid-cols-2 gap-y-16">
            <UserReview userImg="/users/user-1.png" userName="Jonathan">
              "The case feels durable and I even got a compliment on the design. Had the case for
              two and a half months now and{' '}
              <span className="p-0.5 bg-slate-800 text-white">the image is super clear</span>, on
              the case I had before, the image started fading into yellow-ish color after a couple
              of weeks. Love it."
            </UserReview>
            <UserReview userImg="/users/user-4.jpg" userName="Josh">
              I usually keep my phone together with my keys in my pocket and that led to some pretty
              heavy scratch marks on all of my last phone cases. This one, besides a barely
              noticeable scratch on the corner,{'  '}
              <span className="p-0.5 bg-slate-800 text-white">
                looks brand new after about half a year
              </span>
              . I dig it.
            </UserReview>
          </div>
        </Wrapper>

        <div className="pt-16">
          <Reviews />
        </div>
      </section>

      <section>
        <Wrapper className="py-24">
          <div className="mb-12 px-6 lg:px-8">
            <div className="mx-auto max-w-2xl sm:text-center">
              <h2 className="order-1 mt-2 tracking-tight text-center text-balance !leading-tight font-bold text-5xl md:text-6xl text-gray-900">
                Upload your photo and get{' '}
                <span className="relative px-2 bg-green-600 text-white">your own case</span> now
              </h2>
            </div>
          </div>

          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <div className="relative flex flex-col items-center md:grid grid-cols-2 gap-40">
              <img
                src="/arrow.png"
                className="absolute top-[25rem] md:top-1/2 -translate-y-1/2 z-10 left-1/2 -translate-x-1/2 rotate-90 md:rotate-0"
              />

              <div className="relative h-80 md:h-full w-full md:justify-self-end max-w-sm rounded-xl bg-gray-900/5 ring-inset ring-gray-900/10 lg:rounded-2xl">
                <img
                  src="/horse.jpg"
                  className="rounded-md object-cover bg-white shadow-2xl ring-1 ring-gray-900/10 h-full w-full"
                />
              </div>

              <Phone className="w-60" imgSrc="/horse_phone.jpg" />
            </div>
          </div>

          <ul className="mx-auto mt-12 max-w-prose sm:text-lg space-y-2 w-fit">
            <li className="w-fit">
              <Check className="size-5 text-green-600 inline mr-1.5" />
              High-quality silicone material
            </li>
            <li className="w-fit">
              <Check className="size-5 text-green-600 inline mr-1.5" />
              Scratch- and fingerprint-resistant coating
            </li>
            <li className="w-fit">
              <Check className="size-5 text-green-600 inline mr-1.5" />
              Wireless charging compatible
            </li>
            <li className="w-fit">
              <Check className="size-5 text-green-600 inline mr-1.5" />
              5 year print warranty
            </li>
            <div className="flex justify-center">
              <Link
                className={buttonVariants({ size: 'lg', className: 'mx-auto mt-8' })}
                href="/configure/upload"
              >
                Create your case now <ArrowRight className="size-4 ml-1.5" />
              </Link>
            </div>
          </ul>
        </Wrapper>
      </section>
    </div>
  );
}

function UserReview(
  { children, userImg, userName }: { children: ReactNode; userImg: string; userName: string }
) {
  return (
    <div className="flex flex-auto flex-col gap-4 lg:pr-8 xl:pr-20">
      <div className="flex gap-0.5 mb-2">
        <Star className="size-5 text-green-600 fill-green-600" />
        <Star className="size-5 text-green-600 fill-green-600" />
        <Star className="size-5 text-green-600 fill-green-600" />
        <Star className="size-5 text-green-600 fill-green-600" />
        <Star className="size-5 text-green-600 fill-green-600" />
      </div>

      <div className="text-lg leading-8">
        <p>{children}</p>
      </div>
      <div className="flex gap-4 mt-2">
        <img
          className="rounded-full size-12 object-cover"
          src={userImg}
          alt="customer image"
        />
        <div className="flex flex-col">
          <p className="font-semibold">{userName}</p>
          <div className="flex gap-1.5 items-center text-zinc-600">
            <Check className="size-4 stroke-[3px] text-green-600" />
            <p className="text-sm">Verified Purchase</p>
          </div>
        </div>
      </div>
    </div>
  );
}
