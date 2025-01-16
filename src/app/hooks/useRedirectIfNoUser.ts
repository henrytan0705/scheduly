'use client'

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export function useRedirectIfNoUser() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/");  // Redirect to root page if no user is logged in
    }
  }, [user, router]);
}