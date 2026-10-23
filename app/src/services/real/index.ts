import { t } from '@/i18n/de';
import type { Services } from '@/services/types';

// Platzhalter für die echte Anbindung (Phase C: Supabase, RevenueCat, Mux).
// Bis dahin wirft jeder Aufruf eine klare Fehlermeldung statt still zu scheitern.
const notImplemented = (): never => {
  throw new Error(t.errors.notImplemented);
};

const todo = () => new Proxy({}, { get: () => notImplemented }) as never;

export const realServices: Services = {
  auth: todo(),
  clips: todo(),
  purchases: todo(),
  video: todo(),
};
