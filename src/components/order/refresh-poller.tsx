"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function RefreshPoller({ intervalMs = 3000, maxAttempts = 20 }: { intervalMs?: number; maxAttempts?: number }) {
  const router = useRouter();
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (attempts >= maxAttempts) return;
    const t = setTimeout(() => {
      router.refresh();
      setAttempts((a) => a + 1);
    }, intervalMs);
    return () => clearTimeout(t);
  }, [attempts, intervalMs, maxAttempts, router]);

  if (attempts >= maxAttempts) {
    return (
      <p className="text-sm text-muted-foreground">
        This is taking longer than usual. Your payment is safe. You&apos;ll receive an email with your order number and
        tracking link shortly.
      </p>
    );
  }
  return null;
}
