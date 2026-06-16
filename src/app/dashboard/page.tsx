import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { role: true },
  });

  if (!user) {
    redirect("/login");
  }

  if (user.role === "PATIENT") redirect("/dashboard/patient");
  if (user.role === "DOCTOR") redirect("/dashboard/doctor");
  if (user.role === "ADMIN") redirect("/dashboard/admin");

  redirect("/login");
}
