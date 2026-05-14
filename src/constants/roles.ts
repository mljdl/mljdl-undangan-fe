/**
 * Role-name constants (post-normalization dari BE).
 *
 * BE return `user.roleName` (e.g. "Superadmin", "Wedding Admin", "Couple"),
 * lalu FE normalisasi → lowercase + replace whitespace dengan underscore.
 *
 *   "Superadmin"           -> "superadmin"
 *   "Wedding Admin"        -> "wedding_admin"
 *   "Wedding Superadmin"   -> "wedding_superadmin"
 *   "Couple"               -> "couple"
 */

export const ROLE = {
  COUPLE: 'couple',
  WEDDING_ADMIN: 'wedding_admin',
  WEDDING_SUPERADMIN: 'wedding_superadmin',
  SUPERADMIN: 'superadmin',
} as const

/** Roles yang boleh akses /admin/* (review wedding, manage submission). */
export const ADMIN_ROLES: string[] = [
  ROLE.WEDDING_ADMIN,
  ROLE.WEDDING_SUPERADMIN,
  ROLE.SUPERADMIN,
]

/** Roles yang boleh akses /cms/* (couple area). */
export const CMS_ROLES: string[] = [
  ROLE.COUPLE,
  ROLE.WEDDING_ADMIN,
  ROLE.WEDDING_SUPERADMIN,
  ROLE.SUPERADMIN,
]
