/**
 * close the modal when user click on other teacher pages or outside it 
 * Any OTHER teacher page (/teacher/dashboard, /teacher/courses...) → the modal slot is empty.
 * Without it, an open modal would stay on screen when the teacher clicks a sidebar link
 * (a slot keeps showing its last page while nothing new matches it).
 */

export default function CloseModal() {
    return null;
}