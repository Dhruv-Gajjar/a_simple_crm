"use client";

import { AuthService } from "@/services/auth.service";
import { User } from "@/types";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";

interface AuthContextProps {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  isLoading: boolean;
}

const defaultValues = {
  user: null,
  setUser: () => {},
  isLoading: true,
};

export const AuthContext = createContext<AuthContextProps>(defaultValues);

export default function AuthContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const router = useRouter();
  const pathname = usePathname();

  const fetchCurrentUser = useCallback(async () => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser.result);
      if (!currentUser.result) {
        router.replace("/auth/sign-in");
        return;
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    console.log("UseEffect, Current User Not Found.!");

    const isAuthPage =
      pathname.startsWith("/auth/sign-in") ||
      pathname.startsWith("/auth/sign-up") ||
      pathname.startsWith("/signin") ||
      pathname.startsWith("/signup");

    if (!isAuthPage) {
      fetchCurrentUser();
    } else {
      setIsLoading(false);
    }
  }, [fetchCurrentUser, pathname]);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
