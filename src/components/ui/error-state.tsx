import { AlertCircle } from "lucide-react";

export function ErrorState({ title = "Etwas ist schiefgelaufen.", description = "Bitte versuche es später erneut." }: { title?: string; description?: string }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-red-100 bg-red-50/60 px-6 text-center">
      <AlertCircle className="size-5 text-danger" />
      <h3 className="mt-3 text-base font-semibold text-red-900">{title}</h3>
      <p className="mt-1 text-sm text-red-700">{description}</p>
    </div>
  );
}
