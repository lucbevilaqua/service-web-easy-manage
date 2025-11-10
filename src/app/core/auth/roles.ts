import { environment } from "src/environments/environment";

export const ROLES_NAMESPACE = environment.auth0.domain + '/roles';

export function extractRoles(user: Record<string, unknown> | null | undefined): string[] {
  if (!user) return [];
  // Tenta pegar do ID token claims serializados no user$
  const fromNs = (user as any)[ROLES_NAMESPACE];
  if (Array.isArray(fromNs)) return fromNs.filter((r) => typeof r === 'string');
  // fallback: alguns setups usam "roles" direto
  const direct = (user as any).roles;
  if (Array.isArray(direct)) return direct.filter((r) => typeof r === 'string');
  return [];
}

export function hasAllRoles(userRoles: string[], required: string[]): boolean {
  if (!required?.length) return true;
  const set = new Set(userRoles);
  return required.every((r) => set.has(r));
}
