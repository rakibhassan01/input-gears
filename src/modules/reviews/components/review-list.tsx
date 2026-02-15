"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { getProductReviews, getReviewStats } from "../actions";
import { format } from "date-fns";
import NextImage from "next/image";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  images: string[];
  createdAt: string | Date;
  user: {
    name: string;
    image: string | null;
  };
}

interface ReviewListProps {
  productId: string;
}

export default function ReviewList({ productId }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [reviewsRes, statsRes] = await Promise.all([
        getProductReviews(productId),
        getReviewStats(productId),
      ]);

      if (reviewsRes.success) setReviews(reviewsRes.data || []);
      if (statsRes.success) setStats(statsRes.data || { averageRating: 0, totalReviews: 0 });
      setLoading(false);
    }
    loadData();
  }, [productId]);

  if (loading) {
    return <div className="animate-pulse space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-32 bg-gray-100 rounded-2xl" />
      ))}
    </div>;
  }

  return (
    <div className="space-y-8">
      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        <div className="text-center md:border-r border-gray-100 pr-8">
          <div className="text-5xl font-black text-gray-900">{stats.averageRating.toFixed(1)}</div>
          <div className="flex justify-center my-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={20}
                className={cn(
                  "fill-current",
                  s <= Math.round(stats.averageRating) ? "text-yellow-400" : "text-gray-200"
                )}
              />
            ))}
          </div>
          <div className="text-sm font-medium text-gray-500">{stats.totalReviews} Customer Reviews</div>
        </div>

        <div className="col-span-2 space-y-2">
          {/* Detailed bars could go here */}
          <div className="text-sm font-medium text-gray-600 mb-4">Review Summary</div>
          {[5, 4, 3, 2, 1].map((rating) => {
             const count = reviews.filter(r => r.rating === rating).length;
             const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
             return (
               <div key={rating} className="flex items-center gap-4">
                 <div className="text-sm font-bold w-4">{rating}</div>
                 <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                   <div 
                    className="h-full bg-indigo-600 rounded-full" 
                    style={{ width: `${percentage}%` }}
                   />
                 </div>
                 <div className="text-sm font-medium text-gray-400 w-8">{count}</div>
               </div>
             );
          })}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center text-gray-500 italic font-medium">
            Be the first to share your experience with this product! 
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
                    {review.user.image ? (
                      <NextImage 
                        src={review.user.image} 
                        alt={review.user.name} 
                        fill 
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-xl font-bold text-indigo-600">
                        {review.user.name?.[0] || "?"}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{review.user.name}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={14}
                            className={cn(
                              "fill-current",
                              s <= review.rating ? "text-yellow-400" : "text-gray-200"
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full">
                        Verified Purchase
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-400">
                  {format(new Date(review.createdAt), "MMM dd, yyyy")}
                </div>
              </div>

              <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
                {review.comment || <span className="italic">No comment provided.</span>}
              </div>

              {review.images && review.images.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-6">
                  {review.images.map((img: string, idx: number) => (
                    <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden group cursor-pointer border border-gray-100">
                       <NextImage src={img} alt="User Review" fill className="object-cover transition-transform group-hover:scale-110" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
