import type { TFunction } from "i18next";

export function getAuthErrorMessage(error: unknown, t: TFunction): string {
  if (
    error instanceof Error &&
    error.message.includes("Firebase auth is not configured")
  ) {
    return t("auth.errorFirebaseNotConfigured");
  }

  const code =
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code: unknown }).code === "string"
      ? (error as { code: string }).code
      : "";

  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return t("auth.errorInvalidCredentials");
    case "auth/email-already-in-use":
      return t("auth.errorEmailInUse");
    case "auth/weak-password":
      return t("auth.errorWeakPassword");
    case "auth/popup-blocked":
      return t("auth.errorPopupBlocked");
    case "auth/popup-closed-by-user":
      return t("auth.errorPopupClosed");
    case "auth/unauthorized-domain":
      return t("auth.errorUnauthorizedDomain");
    case "auth/operation-not-allowed":
      return t("auth.errorProviderDisabled");
    case "auth/configuration-not-found":
      return t("auth.errorAuthConfigurationMissing");
    case "auth/network-request-failed":
      return t("auth.errorNetwork");
    case "auth/invalid-api-key":
      return t("auth.errorInvalidApiKey");
    case "auth/account-exists-with-different-credential":
      return t("auth.errorAccountExists");
    case "auth/too-many-requests":
      return t("auth.errorTooManyRequests");
    default:
      return t("auth.errorGeneral");
  }
}
