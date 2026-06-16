import { prisma } from "@/lib/db";
import { DoctorList } from "@/components/doctors/doctor-list";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Doctors - Clinic System",
  description: "Browse our doctors and book appointments",
};

export default async function DoctorsPage({
  searchParams,
}: {
  searchParams: Promise<{ specialty?: string; page?: string }>;
}) {
  const params = await searchParams;
  const specialty = params.specialty || "";
  const page = Math.max(1, parseInt(params.page || "1"));
  const limit = 12;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { role: "DOCTOR" };
  if (specialty) where.specialty = specialty;

  const [doctors, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: { id: true, name: true, specialty: true, phone: true },
      skip,
      take: limit,
      orderBy: { name: "asc" },
    }),
    prisma.user.count({ where }),
  ]);

  const specialties = await prisma.user.findMany({
    where: {
      role: "DOCTOR",
      specialty: { not: null },
    },
    distinct: ["specialty"],
    select: { specialty: true },
  });

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-surface-alt">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary">Our Doctors</h1>
          <p className="mt-2 text-text-secondary">
            Browse our team of experienced doctors and book an appointment
          </p>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <a
            href="/doctors"
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              !specialty
                ? "bg-primary text-white"
                : "bg-white text-text-secondary hover:bg-surface-alt border border-border"
            }`}
          >
            All
          </a>
          {specialties.map(
            (s) =>
              s.specialty && (
                <a
                  key={s.specialty}
                  href={`/doctors?specialty=${encodeURIComponent(s.specialty)}`}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    specialty === s.specialty
                      ? "bg-primary text-white"
                      : "bg-white text-text-secondary hover:bg-surface-alt border border-border"
                  }`}
                >
                  {s.specialty}
                </a>
              )
          )}
        </div>

        <DoctorList doctors={doctors} />

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <a
                key={p}
                href={`/doctors?${specialty ? `specialty=${encodeURIComponent(specialty)}&` : ""}page=${p}`}
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  p === page
                    ? "bg-primary text-white"
                    : "bg-white text-text-secondary hover:bg-surface-alt border border-border"
                }`}
              >
                {p}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
