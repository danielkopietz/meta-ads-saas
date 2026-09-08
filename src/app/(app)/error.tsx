"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/error-state";

export default function AppError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Keep the boundary intentionally quiet; a monitoring adapter can be added later.
  }, []);

  return <div className="mx-auto max-w-xl space-y-4"><ErrorState title="Dieser Bereich konnte nicht geladen werden." description="Bitte versuche es erneut. Wenn der Fehler bleibt, prüfe später die Systemmeldungen." /><div className="flex justify-center"><Button onClick={reset}>Erneut versuchen</Button></div></div>;
}
