import Link from "next/link";
import { Card } from "@/components/ui";

export default function ExplorerPage() {
  return (
    <div className="grid gap-6">
      <Card title="API Explorer" subtitle="Hidden from normal user flow">
        <p className="mb-4 text-sm text-slate-200">
          Advanced backend method controls are hidden from this frontend to keep the student UI clean and safe.
        </p>
        <Link
          href="/"
          className="inline-flex rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          Back to Home
        </Link>
      </Card>
    </div>
  );
}
