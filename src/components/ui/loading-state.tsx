export function LoadingState({ label = "Wird geladen …" }: { label?: string }) {
  return (
    <div aria-live="polite" className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-xl border border-border bg-white/60 text-sm text-muted">
      <span className="size-6 animate-spin rounded-full border-2 border-border border-t-primary" />
      {label}
    </div>
  );
}
