
export const USER = {
  EXPIRE_VERTIFY_CODE_SECOND: 3600,
  RESEND_VERTIFY_CODE_SECOND: 120,
  NEW_ACCOUNT_SUBJECT: "Welcome to Thrivelution!",
  RESET_PASSWORD: "Thrivelution: Reset password",
  MINIMUM_AGE_OF_CLIENT: 13,
  MINIMUM_AGE_OF_COUNSELOR: 18,
  REGEX_PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&^])[A-Za-z\d@$!%*#?&^]{8,20}$/,
};

export const CHECK_USER_VALID_CASE = {
  RESEND_VERIFY: "resend_verify",
  LOGIN: "login",
  RESET_PASSWORD: "reset_password",
};
