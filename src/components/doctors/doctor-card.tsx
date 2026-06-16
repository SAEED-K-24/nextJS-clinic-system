import Link from "next/link";
import { Card, CardBody } from "@/components/ui/card";

type DoctorCardProps = {
  doctor: {
    id: string;
    name: string;
    specialty: string | null;
    phone: string | null;
  };
};

export function DoctorCard({ doctor }: DoctorCardProps) {
  const initials = doctor.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Link href={`/doctors/${doctor.id}`}>
      <Card className="h-full transition-shadow hover:shadow-md cursor-pointer">
        <CardBody className="flex flex-col items-center text-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
            {initials}
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">
              Dr. {doctor.name}
            </h3>
            <p className="text-sm text-text-secondary">
              {doctor.specialty || "General Practice"}
            </p>
          </div>
          {doctor.phone && (
            <p className="text-xs text-gray-400">{doctor.phone}</p>
          )}
          <span className="mt-2 rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark">
            Book Appointment
          </span>
        </CardBody>
      </Card>
    </Link>
  );
}
