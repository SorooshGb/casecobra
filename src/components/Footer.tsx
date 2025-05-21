import Link from 'next/link';
import Wrapper from './Wrapper';

function Footer() {
  return (
    <footer className="bg-white">
      <Wrapper className="h-full">
        <div className="border-t border-gray-200" />

        <div className="h-20 flex flex-col md:flex-row md:justify-between justify-center items-center gap-y-2">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} All rights reserved
          </p>

          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-gray-600">Terms</Link>
            <Link href="#" className="hover:text-gray-600">Privacy Policy</Link>
            <Link href="#" className="hover:text-gray-600">Cookie Policy</Link>
          </div>
        </div>
      </Wrapper>
    </footer>
  );
}
export default Footer;
