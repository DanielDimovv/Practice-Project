"use client";
import { createContext, useState, useContext, ReactNode } from "react";
import { UserRole } from "@/server/db/schema";
import { useRouter } from "next/navigation";

type User = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
};

type AuthContextType = {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  const logout = () => {
    setUser(null);
    router.push("/auth");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }

  return context;
}
