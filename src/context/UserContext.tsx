'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface User {
  id: string;
  name: string;
  role: "coach" | "student";
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const updateUser: React.Dispatch<React.SetStateAction<User | null>> = (newUser) => {
    setUser(newUser);
    saveUserToStorage(newUser);
  }

  const saveUserToStorage: React.Dispatch<React.SetStateAction<User | null>> = (user) => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user)); // Save user data to localStorage
    } else {
      localStorage.removeItem("user"); // Remove user data from localStorage on logout
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Parse and set the user data if available
    };
  },[])

  return (
    <UserContext.Provider value={{ user, setUser: updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}