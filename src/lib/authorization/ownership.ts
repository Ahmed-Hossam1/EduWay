//  ownerShip 
export function checkOwnership(user: User, course: course): boolean {
    return user.id === course.ownerId;
}

