import { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const NavBar = ({ children }: { children: ReactNode }) => {
  return (
    <nav className="fixed z-50 w-full px-4 md:px-8 py-4 flex items-center bg-background shadow-sm md:justify-center justify-between gap-4">
      <Link href="/" className="shrink-0 md:absolute md:left-8 z-10">
        <Image src="/images/logo.png" alt="Logo" width={50} height={50} className="w-10 h-10 md:w-[50px] md:h-[50px]" />
      </Link>
      <div className="flex-1 max-w-2xl w-full flex justify-center">
        {children}
      </div>
    </nav>
  );
};