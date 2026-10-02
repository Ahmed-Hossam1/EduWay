import { Role, Paths, Permission } from "./types";

export const RolePaths: Record<Role, Paths[]> = {
    [Role.STUDENT]: [
        Paths.STUDENT_DASHBOARD,
    ],
    [Role.TEACHER]: [
        Paths.STUDENT_DASHBOARD,
        Paths.TEACHER_DASHBOARD,
    ],
    [Role.ADMIN]: [
        Paths.STUDENT_DASHBOARD,
        Paths.TEACHER_DASHBOARD,
        Paths.ADMIN_DASHBOARD,
    ],
};

export const RolePermissions: Record<Role, Permission[]> = {
    [Role.STUDENT]: [
        Permission.READ_COURSE,
    ],
    [Role.TEACHER]: [
        Permission.READ_COURSE,
        Permission.CREATE_COURSE,
        Permission.UPDATE_COURSE,
    ],
    [Role.ADMIN]: [
        Permission.READ_COURSE,
        Permission.CREATE_COURSE,
        Permission.UPDATE_COURSE,
        Permission.DELETE_COURSE,
    ],
};
