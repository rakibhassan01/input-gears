import { Suspense } from "react";
import { getAbandonedCarts } from "@/modules/admin/actions/abandoned-cart-actions";
import { AbandonedCartsTable } from "@/modules/admin/components/abandoned-carts-table";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "Abandoned Carts | Admin",
};

function AbandonedCartsLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

async function AbandonedCartsContent() {
  const carts = await getAbandonedCarts();

  return <AbandonedCartsTable data={carts} />;
}

export default function AbandonedCartsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Abandoned Carts</h2>
          <p className="text-muted-foreground">
            Monitor users who left items in their cart without completing a purchase.
          </p>
        </div>
      </div>
      <div className="space-y-4">
        <Suspense fallback={<AbandonedCartsLoading />}>
          <AbandonedCartsContent />
        </Suspense>
      </div>
    </div>
  );
}
