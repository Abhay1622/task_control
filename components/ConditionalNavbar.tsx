'use client';

import { usePathname } from 'next/navigation';
import NavbarWrapper from './NavbarWrapper';

const ROUTES_WITHOUT_NAVBAR = ['/login', '/register'];

export default function ConditionalNavbar() {
  const pathname = usePathname();
  
  const hideNavbar = ROUTES_WITHOUT_NAVBAR.includes(pathname);
  
  if (hideNavbar) {
    return null;
  }
  
  return <NavbarWrapper />;
}