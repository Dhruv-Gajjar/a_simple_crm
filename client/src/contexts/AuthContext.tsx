"use client";

import { AuthService } from "@/services/auth.service";
import { User } from "@/types";
import { useRouter } from "next/navigation";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";

interface AuthContextProps {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  // token: string | null;
  // setToken: Dispatch<SetStateAction<string | null>>;
}

const defaultValues = {
  user: null,
  // token: null,
  setUser: () => {},
  // setToken: () => {},
};

export const AuthContext = createContext<AuthContextProps>(defaultValues);

export default function AuthContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);

  const router = useRouter();

  useEffect(() => {
    console.log("UseEffect, Current User Not Found.!");
    const fetchCurrentUser = async () => {
      const currentUser = await AuthService.getCurrentUser();

      console.log("Current User Not Found.!", currentUser.result);
      if (!currentUser.result) {
        router.replace("/auth/sign-in");
        return;
      }

      setUser(currentUser.result);
    };

    fetchCurrentUser();
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
