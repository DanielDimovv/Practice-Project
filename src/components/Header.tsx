"use client";
import { useCurrentUser, useLogout } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import Link from "next/link";

export default function Header() {
  const { data: user } = useCurrentUser();
  const { mutate: logout } = useLogout();
  const router = useRouter();
  return (
    <>
      <header>
        <nav className="grid grid-cols-3 items-center p-2 sm:p-4 border-b">
          <div className="text-left">
            <Link href="/dashboard" className="text-sm sm:text-base">
              Dashboard
            </Link>
          </div>

          <div className="text-center">
            {user?.role === "admin" && (
              <Link href="/create-project" className="text-sm sm:text-base">
                Add Project
              </Link>
            )}
          </div>

          <div className="text-right">
            <Button
              size="sm"
              onClick={() => {
                logout(undefined, {
                  onSuccess: () => {
                    router.push("/auth");
                  },
                });
              }}
            >
              Logout
            </Button>
          </div>
        </nav>
      </header>
    </>
  );
}
