export enum Role {
    ADMIN = "admin",
    TEACHER = "teacher",
    STUDENT = "student",
}

export enum Paths {
    STUDENT_DASHBOARD = "Student Dashboard",
    TEACHER_DASHBOARD = "Teacher Dashboard",
    ADMIN_DASHBOARD = "Admin Dashboard",
}

export enum Permission {
    READ_COURSE = "course.read",
    CREATE_COURSE = "course.create",
    UPDATE_COURSE = "course.update",
    DELETE_COURSE = "course.delete",
}

export interface User {
    id: number | string;
    name: string;
    role: Role;
}

export interface Course {
    id: number | string;
    title: string;
    ownerId: number | string;
}
