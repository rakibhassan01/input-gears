"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import Image from "next/image";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface AbandonedCartItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image: string | null;
}

interface AbandonedCart {
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string | null;
  itemsCount: number;
  totalAmount: number;
  lastActive: Date;
  items: AbandonedCartItem[];
}

interface AbandonedCartsTableProps {
  data: AbandonedCart[];
}

export function AbandonedCartsTable({ data }: AbandonedCartsTableProps) {
  if (data.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed text-center">
        <div className="text-muted-foreground">No abandoned carts found.</div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total Value</TableHead>
            <TableHead>Last Active</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((cart) => (
            <TableRow key={cart.userId}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{cart.userName}</span>
                  <span className="text-xs text-muted-foreground">
                    {cart.userEmail}
                  </span>
                </div>
              </TableCell>
              <TableCell>{cart.userPhone || "N/A"}</TableCell>
              <TableCell>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <div className="cursor-pointer underline-offset-4 hover:underline">
                      <Badge variant="secondary">
                        {cart.itemsCount} {cart.itemsCount === 1 ? "item" : "items"}
                      </Badge>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">Cart Items</h4>
                      <div className="flex flex-col gap-2">
                        {cart.items.map((item) => (
                          <div
                            key={item.productId}
                            className="flex items-center gap-2"
                          >
                            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded border">
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.productName}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex flex-col">
                              <span className="line-clamp-1 text-xs font-medium">
                                {item.productName}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {item.quantity} x {formatPrice(item.price)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </TableCell>
              <TableCell className="font-semibold">
                {formatPrice(cart.totalAmount)}
              </TableCell>
              <TableCell>
                {format(new Date(cart.lastActive), "MMM d, yyyy HH:mm")}
              </TableCell>
              <TableCell className="text-right">
                <Badge className="bg-orange-100 text-orange-600 hover:bg-orange-100">
                  Abandoned
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
