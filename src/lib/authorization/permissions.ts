//  Permissions
export function getUserPermissions(user: User): Permission[] {
    return RolePermissions[user.role]
}

export function isUserHasPermission(
    user: User,
    permission: Permission
): boolean {
    return getUserPermissions(user).includes(permission);
}


