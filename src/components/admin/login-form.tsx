"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { loginAction, type AdminFormState } from "@/app/actions/admin";
import { FormField } from "@/components/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState<AdminFormState, FormData>(loginAction, {});
  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={next ?? ""} />
      <FormField id="password" label="Password" required>
        <Input id="password" name="password" type="password" className="h-10" autoFocus autoComplete="current-password" />
      </FormField>
      {state.message && <p className="text-sm text-destructive">{state.message}</p>}
      <Button type="submit" className="h-10 w-full" disabled={pending}>
        {pending && <Loader2 className="animate-spin" />} Sign in
      </Button>
    </form>
  );
}
