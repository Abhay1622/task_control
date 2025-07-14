// types/next-auth.d.ts

import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      _id: string;
      name: string;
      id: string;
      email: string;
    }
  }

  interface User {
    id: string;
    email: string;
  }
}
