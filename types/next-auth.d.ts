import type { DefaultSession } from "next-auth";

// Extend Auth.js types so `session.user.id` and `session.user.role`
// (GUEST / HOTEL_MANAGER / ADMIN) are available and typed everywhere.
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "GUEST" | "HOTEL_MANAGER" | "ADMIN";
    } & DefaultSession["user"];
  }

  interface User {
    role: "GUEST" | "HOTEL_MANAGER" | "ADMIN";
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: "GUEST" | "HOTEL_MANAGER" | "ADMIN";
  }
}
