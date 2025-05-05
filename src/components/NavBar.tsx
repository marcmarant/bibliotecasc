import { ReactNode } from 'react';
import Link from 'next/link';

export const NavBar = ({ children }: { children: ReactNode }) => {
  return (
    <nav className="fixed z-50 w-full px-8 py-6 flex items-center bg-background shadow-sm">
      <Link href="/" className="absolute">
        <img src="images/logo.png" alt="Logo" className="h-12" />
      </Link>
      {children}
    </nav>
  );
};