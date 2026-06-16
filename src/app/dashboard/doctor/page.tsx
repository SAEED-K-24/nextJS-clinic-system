import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AppointmentList } from "@/components/appointments/appointment-list";
import { redirect } from "next/navigation";

export default async function DoctorDashboardPage() {
  const session = await getSession();
  if (!session || session.role !== "DOCTOR") redirect("/login");

  const doctor = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { name: true, specialty: true },
  });

  const appointments = await prisma.appointment.findMany({
    where: { doctorId: session.userId },
    include: {
      patient: { select: { id: true, name: true } },
    },
    orderBy: { date: "desc" },
  });

  const serialized = appointments.map((a) => ({
    ...a,
    date: a.date.toISOString(),
    doctor: undefined,
  }));

  const pendingCount = serialized.filter((a) => a.status === "PENDING").length;
  const confirmedCount = serialized.filter(
    (a) => a.status === "CONFIRMED"
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">
          Welcome, Dr. {doctor?.name}
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          {doctor?.specialty || "General Practice"}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-white p-4">
          <p className="text-sm text-text-secondary">Pending</p>
          <p className="mt-1 text-2xl font-bold text-warning">{pendingCount}</p>
        </div>
        <div className="rounded-xl border border-border bg-white p-4">
          <p className="text-sm text-text-secondary">Confirmed</p>
          <p className="mt-1 text-2xl font-bold text-secondary">
            {confirmedCount}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-white p-4">
          <p className="text-sm text-text-secondary">Total</p>
          <p className="mt-1 text-2xl font-bold text-primary">
            {serialized.length}
          </p>
        </div>
      </div>

      <AppointmentList
        appointments={serialized}
        role="DOCTOR"
        title="Today's Schedule"
      />
    </div>
  );
}
