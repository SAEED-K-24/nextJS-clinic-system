import { DoctorCard } from "@/components/doctors/doctor-card";

type DoctorListProps = {
  doctors: Array<{
    id: string;
    name: string;
    specialty: string | null;
    phone: string | null;
  }>;
};

export function DoctorList({ doctors }: DoctorListProps) {
  if (doctors.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-12 text-center">
        <p className="text-lg text-text-secondary">No doctors found</p>
        <p className="mt-1 text-sm text-gray-400">
          Try adjusting your search or filter
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {doctors.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  );
}
