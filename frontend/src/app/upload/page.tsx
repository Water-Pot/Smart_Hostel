import Link from "next/link";
import { Card } from "@/components/ui";

export default function UploadPage() {
  return (
    <div className="grid gap-6">
      <Card title="Image Upload" subtitle="Moved to Profile page">
        <p className="mb-4 text-sm text-slate-200">Please upload your profile image from the Profile page after login.</p>
        <Link
          href="/profile"
          className="inline-flex rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          Go to Profile
        </Link>
      </Card>
    </div>
  );
}
