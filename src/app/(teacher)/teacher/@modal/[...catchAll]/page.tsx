/**
 * Close the modal when the teacher goes to another teacher page.
 * Any /teacher/... page (/teacher/dashboard, /teacher/courses...) → the modal slot is empty.
 * Without it, an open modal would stay on screen when the teacher clicks a sidebar link
 * (a slot keeps showing its last page while nothing new matches it).
 * (this slot lives in app/(teacher)/teacher → the catch-all only matches /teacher/... urls)
 */

export default function CloseModal() {
    return null;
}
