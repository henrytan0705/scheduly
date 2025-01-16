'use client'

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { coachMockUser, studentMockUser } from "@/constants/users";

export default function HomePage() {
  const router = useRouter();
  const { user, setUser } = useUser();

  const handleClick = (role: string) => {
    const userInfo = role === "coach" ? coachMockUser : studentMockUser 
    setUser(userInfo)
    router.push("/home");
  }

  useEffect(() => {
    if (user) router.push('/home');
  },[user, router])

  return (
    <div className="text-center container my-4 mx-auto">
      <h1 className="text-3xl mb-4">Scheduly</h1>

      <div className="flex gap-2 justify-center">
        <Button onClick={() => handleClick('coach')}>
          Coach Login
        </Button>
        <Button onClick={() => handleClick('student')}>
          Student Login
        </Button>
      </div>

    </div>
  )
}
