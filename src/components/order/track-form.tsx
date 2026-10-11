"use client";

import { useActionState } from "react";
import { Loader2, Search } from "lucide-react";
import { trackOrderAction, type TrackState } from "@/app/actions/track";
import { FormField } from "@/components/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function TrackForm() {
  const [state, formAction, pending] = useActionState<TrackState, FormData>(trackOrderAction, {});

  return (
    <form action={formAction} className="space-y-4">
      <FormField id="orderNumber" label="Order number" required>
        <Input
          id="orderNumber"
          name="orderNumber"
          placeholder="UCR27-XXXXXXXX"
          className="h-10 uppercase"
          defaultValue={state.values?.orderNumber}
        />
      </FormField>
      <FormField id="email" label="Email address" required>
        <Input id="email" name="email" type="email" className="h-10" defaultValue={state.values?.email} />
      </FormField>
      {state.message && <p className="text-sm text-destructive">{state.message}</p>}
      <Button type="submit" size="lg" className="h-11 w-full" disabled={pending}>
        {pending ? <Loader2 className="animate-spin" /> : <Search />} Track order
      </Button>
    </form>
  );
}
