import { AppointmentCard } from "@/components/appointments/appointment-card";
import { Card, CardBody, CardHeader } from "@/components/ui/card";

type Appointment = {
  id: string;
  date: string;
  status: string;
  notes: string | null;
  patient?: { id: string; name: string };
  doctor?: { id: string; name: string; specialty: string | null };
};

type AppointmentListProps = {
  appointments: Appointment[];
  role: string;
  title?: string;
};

export function AppointmentList({
  appointments,
  role,
  title,
}: AppointmentListProps) {
  const active = appointments.filter(
    (a) => a.status !== "CANCELLED" && a.status !== "COMPLETED"
  );
  const completed = appointments.filter(
    (a) => a.status === "COMPLETED" || a.status === "CANCELLED"
  );

  return (
    <div className="space-y-6">
      {title && (
        <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
      )}

      {active.length === 0 && completed.length === 0 && (
        <Card>
          <CardBody>
            <p className="text-text-secondary">No appointments found.</p>
          </CardBody>
        </Card>
      )}

      {active.length > 0 && (
        <div className="space-y-3">
          {active.map((a) => (
            <AppointmentCard key={a.id} appointment={a} role={role} />
          ))}
        </div>
      )}

      {completed.length > 0 && (
        <details className="group">
          <summary className="cursor-pointer text-sm font-medium text-text-secondary hover:text-text-primary">
            Past appointments ({completed.length})
          </summary>
          <div className="mt-3 space-y-3">
            {completed.map((a) => (
              <AppointmentCard key={a.id} appointment={a} role={role} />
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
