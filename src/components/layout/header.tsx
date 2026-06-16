"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  userName: string;
  userRole: string;
}

export function Header({ userName, userRole }: HeaderProps) {
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.success("Logged out");
      router.push("/login");
      router.refresh();
    } catch {
      toast.error("Logout failed");
    }
  }

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <a href="/dashboard" className="text-xl font-bold text-primary">
            ClinicSystem
          </a>
          <span className="rounded-full bg-surface-alt px-3 py-1 text-xs font-medium text-primary-dark">
            {userRole}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-text-secondary">{userName}</span>
          <Button variant="ghost" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
