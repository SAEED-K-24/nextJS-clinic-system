import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-xl font-bold text-primary">
            ClinicSystem
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-text-secondary hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              href="/doctors"
              className="text-sm font-medium text-text-secondary hover:text-primary transition-colors"
            >
              Services
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium text-text-secondary hover:text-primary transition-colors"
            >
              Register
            </Link>
            <Link
              href="/login"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
            >
              Sign In
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex flex-1 items-center">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="max-w-xl">
            <h1 className="text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
              Your Health,{" "}
              <span className="text-primary">Our Priority</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-text-secondary">
              Book appointments with the best doctors, manage your schedule,
              and receive quality care — all from one place.
            </p>
            <div className="mt-10 flex items-center gap-4">
              <Link
                href="/register"
                className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-primary-dark transition-colors"
              >
                Get Started →
              </Link>
              <Link
                href="/login"
                className="rounded-lg border border-border px-6 py-3 text-sm font-medium text-text-primary hover:bg-surface-alt transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <svg
              viewBox="0 0 400 400"
              className="w-full max-w-md"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="200" cy="200" r="180" fill="#f0fdf4" />
              <circle cx="200" cy="180" r="70" fill="#059669" opacity="0.15" />
              <rect
                x="150"
                y="130"
                width="100"
                height="120"
                rx="12"
                fill="white"
                stroke="#059669"
                strokeWidth="3"
              />
              <line
                x1="200"
                y1="150"
                x2="200"
                y2="230"
                stroke="#059669"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <line
                x1="170"
                y1="190"
                x2="230"
                y2="190"
                stroke="#059669"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="200" cy="180" r="30" fill="#059669" opacity="0.25" />
              <path
                d="M140 310 Q200 270 260 310"
                stroke="#059669"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="170" cy="340" r="8" fill="#0ea5e9" opacity="0.4" />
              <circle cx="230" cy="340" r="8" fill="#0ea5e9" opacity="0.4" />
              <circle cx="200" cy="350" r="6" fill="#0ea5e9" opacity="0.3" />
              <circle cx="120" cy="220" r="12" fill="#0ea5e9" opacity="0.2" />
              <circle cx="280" cy="220" r="12" fill="#0ea5e9" opacity="0.2" />
              <circle cx="100" cy="150" r="8" fill="#059669" opacity="0.15" />
              <circle cx="300" cy="150" r="8" fill="#059669" opacity="0.15" />
              <circle cx="320" cy="280" r="10" fill="#0ea5e9" opacity="0.15" />
              <circle cx="80" cy="280" r="10" fill="#0ea5e9" opacity="0.15" />
            </svg>
          </div>
        </div>
      </main>
    </div>
  );
}
