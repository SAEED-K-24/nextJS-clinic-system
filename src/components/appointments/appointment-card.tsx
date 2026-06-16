"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cancelAppointment, updateAppointmentStatus } from "@/actions/appointments";
import { formatDateTime } from "@/lib/utils";

type Appointment = {
  id: string;
  date: string;
  status: string;
  notes: string | null;
  patient?: { id: string; name: string };
  doctor?: { id: string; name: string; specialty: string | null };
};

type AppointmentCardProps = {
  appointment: Appointment;
  role: string;
};

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-gray-100 text-gray-500",
};

export function AppointmentCard({ appointment, role }: AppointmentCardProps) {
  const router = useRouter();
  const isPast = new Date(appointment.date) < new Date();
  const hoursUntil =
    (new Date(appointment.date).getTime() - Date.now()) / 3600000;

  async function handleCancel() {
    try {
      await cancelAppointment(appointment.id);
      toast.success("Appointment cancelled");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to cancel");
    }
  }

  async function handleConfirm() {
    try {
      await updateAppointmentStatus(appointment.id, "CONFIRMED");
      toast.success("Appointment confirmed");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to confirm");
    }
  }

  async function handleComplete() {
    try {
      await updateAppointmentStatus(appointment.id, "COMPLETED");
      toast.success("Appointment completed");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to complete");
    }
  }

  if (appointment.status === "CANCELLED" || appointment.status === "COMPLETED") {
    return null;
  }

  return (
    <Card>
      <CardBody className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10 text-sm font-bold text-secondary">
            {role === "PATIENT"
              ? appointment.doctor?.name.charAt(0)
              : appointment.patient?.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-text-primary">
              {role === "PATIENT"
                ? `Dr. ${appointment.doctor?.name}`
                : appointment.patient?.name}
            </p>
            <p className="text-sm text-text-secondary">
              {formatDateTime(appointment.date)}
            </p>
            {appointment.notes && (
              <p className="mt-1 text-xs text-gray-400">
                {appointment.notes}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
              statusColors[appointment.status] || ""
            }`}
          >
            {appointment.status}
          </span>

          {role === "PATIENT" &&
            hoursUntil > 24 &&
            (appointment.status === "PENDING" ||
              appointment.status === "CONFIRMED") && (
              <Button variant="danger" onClick={handleCancel}>
                Cancel
              </Button>
            )}

          {role === "DOCTOR" && appointment.status === "PENDING" && (
            <div className="flex gap-2">
              <Button variant="primary" onClick={handleConfirm}>
                Confirm
              </Button>
              <Button variant="danger" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          )}

          {role === "DOCTOR" && appointment.status === "CONFIRMED" && (
            <Button variant="primary" onClick={handleComplete}>
              Complete
            </Button>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
