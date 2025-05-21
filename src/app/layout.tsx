import './globals.css';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Toaster } from '@/components/ui/sonner';
import Providers from '@/context/Providers';
import { constructMetadata } from '@/lib/utils';
import { Recursive } from 'next/font/google';

const recursive = Recursive({ subsets: ['latin'] });

export const metadata = constructMetadata();

export default function RootLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${recursive.className} antialiased`}
      >
        <Navbar />
        <main className="flex flex-col min-h-[calc(100vh-3.5rem-1px)] grainy-light">
          <Providers>{children}</Providers>
          <Footer />
        </main>
        <Toaster richColors />
      </body>
    </html>
  );
}
