import { Course, User } from "./types";

export function checkOwnership(user: User, course: Course): boolean {
    return user.id === course.ownerId;
}
