// What POST /api/auth/signup answers:
//   "Confirm email" ON  → { needsConfirmation: true, email }  → the form shows "Check your inbox"
//   "Confirm email" OFF → { nextRoute }                       → go there (usually /account/choose-role)
export type SignupResponse =
    | { needsConfirmation: true; email: string }
    | { needsConfirmation?: false; nextRoute: string };
