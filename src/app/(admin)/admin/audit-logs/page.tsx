import { Suspense } from "react";
import { getAuditLogs } from "@/modules/admin/actions/audit-actions";
import { AuditLogsTable } from "@/modules/admin/components/audit-logs-table";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "Audit Logs | Admin",
};

function AuditLogsLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

async function AuditLogsContent() {
  const logs = await getAuditLogs();

  return <AuditLogsTable data={logs} />;
}

export default function AuditLogsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Audit Logs</h2>
          <p className="text-muted-foreground">
            A security trail of sensitive actions performed by administrators.
          </p>
        </div>
      </div>
      <div className="space-y-4">
        <Suspense fallback={<AuditLogsLoading />}>
          <AuditLogsContent />
        </Suspense>
      </div>
    </div>
  );
}
