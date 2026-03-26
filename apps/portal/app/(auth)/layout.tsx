import Image from "next/image";
import AuroraBackdrop from "../../components/aurora-backdrop";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4">
      <AuroraBackdrop />

      <div className="relative z-10 w-full max-w-[420px]">
        <div className="rounded-2xl bg-neutral-900 border border-neutral-700/50 p-8 shadow-lg">
          <div className="mb-8 flex justify-center">
            <Image
              src="/orgosynclogo.svg"
              alt="Orgo Sync"
              width={160}
              height={40}
              priority
            />
          </div>
          {children}
        </div>
      </div>

      <p className="relative z-10 mt-8 text-caption text-white/40">
        &copy; {new Date().getFullYear()} Orgo. All rights reserved.
      </p>
    </div>
  );
}
