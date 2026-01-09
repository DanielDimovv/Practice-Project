"use client";
import { useCurrentUser, useLogout } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import Link from "next/link";
import ManageRoleDialog from "./ManageRoleDialog";
import { usePathname } from "next/navigation";

export default function Header() {
  const { data: user } = useCurrentUser();
  const { mutate: logout } = useLogout();
  const router = useRouter();
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard";

  return (
    <header className="border-b">
      <nav className="p-2 sm:p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Left side */}
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>

          <div className="flex flex-wrap items-center gap-2">
            {user?.role === "admin" && isDashboard && (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/create-project">Add Project</Link>
                </Button>
                <ManageRoleDialog />
              </>
            )}
            <Button
              size="sm"
              onClick={() =>
                logout(undefined, {
                  onSuccess: () => router.push("/auth"),
                })
              }
            >
              Logout
            </Button>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Welcome,{" "}
          <span className="font-medium text-foreground">{user?.name}</span>
          {user?.role === "admin" && <span className="ml-1">(Admin)</span>}
        </p>
      </nav>
    </header>
  );
}
