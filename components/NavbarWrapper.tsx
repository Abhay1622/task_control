'use client'

import { useSession } from "next-auth/react";
import Navbar from "./Navbar";
import { usePathname } from "next/navigation";

const Hidden_Path = ['/login', '/register']

export default function NavbarWrapper() {
  const pathname = usePathname();
  const { data: session } = useSession();

  if (Hidden_Path.includes(pathname)) {
    return null;
  }
  
  return <Navbar session={session} />;
}