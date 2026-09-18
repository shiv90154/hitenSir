"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/lib/auth/actions";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-ink">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-1 w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-navy"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-ink">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-1 w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-navy"
        />
      </div>

      {state.error && <p className="text-sm text-orange">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-navy px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {isPending ? "Signing in…" : "Sign in"}
      </button>

      <p className="text-center text-xs text-ink-soft">
        Lost your password? Reset it with{" "}
        <code className="rounded bg-admin-surface px-1 py-0.5">npm run seed:admin</code> after setting a
        new one in <code className="rounded bg-admin-surface px-1 py-0.5">ADMIN_PASSWORD</code> in{" "}
        <code className="rounded bg-admin-surface px-1 py-0.5">.env</code>.
      </p>
    </form>
  );
}
