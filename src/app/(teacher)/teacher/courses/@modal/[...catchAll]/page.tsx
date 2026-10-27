/**
 * Close the modal when the teacher goes to another page under /teacher/courses
 * (/teacher/courses/new, /teacher/courses/<id>/edit...) while it is open.
 * A slot keeps showing its last page while nothing new matches it → this empty page matches them all.
 * (@modal/page.tsx does the same for /teacher/courses itself)
 */
export default function CloseModal() {
    return null;
}
