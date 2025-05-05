import { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const NavBar = ({ children }: { children: ReactNode }) => {
  return (
    <nav className="fixed z-50 w-full px-8 py-6 flex items-center bg-background shadow-sm">
      <Link href="/" className="absolute">
        <Image src="/images/logo.png" alt="Logo" width={50} height={50} />
      </Link>
      {children}
    </nav>
  );
};