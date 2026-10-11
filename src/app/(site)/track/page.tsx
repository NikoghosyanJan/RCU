import type { Metadata } from "next";
import { TrackForm } from "@/components/order/track-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Track your order" };

export default function TrackPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Track your UCR order</CardTitle>
          <CardDescription>
            Enter the order number from your receipt email and the email address you used at checkout.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TrackForm />
        </CardContent>
      </Card>
    </div>
  );
}
