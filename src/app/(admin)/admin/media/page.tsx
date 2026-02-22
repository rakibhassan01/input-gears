import { Suspense } from "react";
import { getMedia } from "@/modules/admin/actions/media-actions";
import { MediaGallery } from "@/modules/admin/components/media-gallery";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "Media Library | Admin",
};

function MediaLoading() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <Skeleton key={i} className="aspect-square rounded-xl" />
      ))}
    </div>
  );
}

async function MediaContent() {
  const media = await getMedia();
  return <MediaGallery initialMedia={media} />;
}

export default function MediaPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Media Library</h2>
          <p className="text-muted-foreground">
            Manage and re-use all uploaded images across the store.
          </p>
        </div>
      </div>
      <div className="space-y-4 pt-4">
        <Suspense fallback={<MediaLoading />}>
          <MediaContent />
        </Suspense>
      </div>
    </div>
  );
}
