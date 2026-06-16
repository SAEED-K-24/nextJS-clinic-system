import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { comparePassword, signToken } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";
import { cookies } from "next/headers";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const rateCheck = rateLimit(`login:${ip}`, 5, 60_000);
    if (!rateCheck.allowed) {
      return Response.json(
        { error: "Too many login attempts. Try again in 60 seconds." },
        { status: 429 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (user?.lockedUntil && user.lockedUntil > new Date()) {
      return Response.json(
        {
          error: "Account is temporarily locked due to too many failed attempts. Try again later.",
        },
        { status: 423 }
      );
    }

    if (!user) {
      return Response.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const valid = await comparePassword(password, user.passwordHash);

    if (!valid) {
      const newAttempts = user.failedLoginAttempts + 1;
      const updates: Record<string, unknown> = {
        failedLoginAttempts: newAttempts,
      };

      if (newAttempts >= 5) {
        updates.lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
      }

      await prisma.user.update({
        where: { id: user.id },
        data: updates,
      });

      return Response.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (user.failedLoginAttempts > 0 || user.lockedUntil) {
      await prisma.user.update({
        where: { id: user.id },
        data: { failedLoginAttempts: 0, lockedUntil: null },
      });
    }

    const token = signToken({ userId: user.id, role: user.role });

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return Response.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
