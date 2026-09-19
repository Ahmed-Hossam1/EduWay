type User = {
    id: number;
    name: string;
    role: Role;
};

type course = {
    id: number,
    title: string,
    ownerId: number,
}


enum Role {
    ADMIN = "admin",
    TEACHER = "teacher",
    STUDENT = "student"
}

enum Paths {
    STUDENT_DASHBOARD = "Student Dashboard",
    TEACHER_DASHBOARD = "Teacher Dashboard",
    ADMIN_DASHBOARD = "Admin Dashboard"
}


const RolePaths: Record<Role, Paths[]> = {
    [Role.STUDENT]: [
        Paths.STUDENT_DASHBOARD
    ],

    [Role.TEACHER]: [
        Paths.STUDENT_DASHBOARD,
        Paths.TEACHER_DASHBOARD
    ],

    [Role.ADMIN]: [
        Paths.STUDENT_DASHBOARD,
        Paths.TEACHER_DASHBOARD,
        Paths.ADMIN_DASHBOARD
    ]
};


enum Permission {
    READ_COURSE = "course.read",
    CREATE_COURSE = "course.create",
    UPDATE_COURSE = "course.update",
    DELETE_COURSE = "course.delete",
}


const RolePermissions: Record<Role, Permission[]> = {
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

const user1: User = {
    id: 1,
    name: "Ahmed",
    role: Role.STUDENT
};

const user2: User = {
    id: 2,
    name: "Mohamed",
    role: Role.TEACHER
};

const user3: User = {
    id: 3,
    name: "Ali",
    role: Role.ADMIN
};


const course1: course = {
    id: 1,
    title: "Advanced CSS",
    ownerId: user1.id
}

const course2: course = {
    id: 2,
    title: "Advanced JS",
    ownerId: user2.id
}



// 1- Paths
function getRolePaths(user: User): string[] {
    return RolePaths[user.role];
}

function isPathAllowedForUser(user: User, path: Paths): boolean {
    return getRolePaths(user).includes(path);
}