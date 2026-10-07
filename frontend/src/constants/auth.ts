export const AUTH_STRINGS = {
  TITLES: {
    LOGIN: "Sign In to ArmorNode",
    REGISTER: "Sign Up",
  },
  TABS: {
    LOGIN: "Sign In",
    REGISTER: "Sign Up",
  },
  LABELS: {
    EMAIL: "Email Address",
    PASSWORD: "Password",
    CONFIRM_PASSWORD: "Confirm Password",
  },
  PLACEHOLDERS: {
    EMAIL: "user@example.com",
    PASSWORD: "••••••••",
  },
  BUTTONS: {
    SUBMIT_LOGIN: "Sign In",
    SUBMIT_REGISTER: "Sign Up",
    SIGNING_IN: "Signing in...",
    CREATING_ACCOUNT: "Creating account...",
    PROCESSING: "Processing...",
    CLOSE_ARIA: "Close modal",
  },
  OAUTH: {
    GOOGLE_CONTINUE: "Continue with Google",
    GOOGLE_NOT_IMPLEMENTED: "Google Sign-In is not implemented yet.",
    DIVIDER_OR: "or",
  },
  LINKS: {
    FORGOT_PASSWORD: "Forgot password?",
    NEW_TO_ARMORNODE: "New to ARMORNODE?",
    CREATE_ACCOUNT: "Create an account",
    ALREADY_HAVE_ACCOUNT: "Already have an account?",
    SIGN_IN: "Sign in",
  },
  BRAND: {
    SIGN_IN_HEADING: "Sign in to",
    SIGN_UP_HEADING: "Sign up to",
  },
  HINTS: {
    PASSWORD_REQUIREMENTS:
      "Must be at least 8 characters with uppercase, lowercase, numbers, and symbols.",
  },
  ERRORS: {
    FILL_ALL_FIELDS: "Please fill in all required fields.",
    PASSWORDS_DONT_MATCH: "Passwords do not match.",
    PASSWORD_MIN_LENGTH: "Password must be at least 8 characters long.",
    LOGIN_FAILED: "Login failed. Please check your credentials.",
    REGISTER_FAILED: "Registration failed. Please try again.",
    UNEXPECTED: "An unexpected error occurred. Please try again.",
  },
} as const;

export const AUTH_MODES = {
  LOGIN: "login",
  REGISTER: "register",
} as const;

export type AuthMode = (typeof AUTH_MODES)[keyof typeof AUTH_MODES];
