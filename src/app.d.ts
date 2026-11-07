import type { AuthenticatedUser } from "$lib/auth/session";
import type { Session } from "@prisma/client";

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      user: AuthenticatedUser | null;
      session: Session | null;
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
