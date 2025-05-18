import { env } from '@/data/env/client';
import { type ClassValue, clsx } from 'clsx';
import { Metadata } from 'next';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
  const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

  return formatter.format(price);
}

export function constructMetadata(
  {
    title = 'CaseCobra - custom high-quality phone cases',
    description = 'Create custom hight-quality phone cases in seconds',
    image = '/thumbnail.png',
    icons = '/favicon.ico'
  } = {}
): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image }],
    },
    twitter: {
      card: 'summary_large_image',
      description,
      images: [image],
    },
    icons,
    metadataBase: new URL(env.NEXT_PUBLIC_SERVER_URL),
  };
}
