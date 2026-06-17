const ROLE_HIERARCHY: Record<string, number> = {
  owner: 4,
  admin: 3,
  seller: 2,
  user: 1,
}

export function hasSufficientRole(userRole: string, requiredRole: string): boolean {
  const userLevel = ROLE_HIERARCHY[userRole] ?? 0
  const requiredLevel = ROLE_HIERARCHY[requiredRole] ?? 0
  return userLevel >= requiredLevel
}
