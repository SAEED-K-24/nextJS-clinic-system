import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const specialty = searchParams.get("specialty");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "10")));
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { role: "DOCTOR" };
    if (specialty) where.specialty = specialty;

    const [doctors, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          specialty: true,
          phone: true,
          imageUrl: true,
        },
        skip,
        take: limit,
        orderBy: { name: "asc" },
      }),
      prisma.user.count({ where }),
    ]);

    return Response.json({ doctors, total, page, limit });
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
