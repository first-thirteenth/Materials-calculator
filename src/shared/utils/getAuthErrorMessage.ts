import type { TFunction } from "i18next";

export function getAuthErrorMessage(error: unknown, t: TFunction): string {
  const message = error instanceof Error ? error.message.toLowerCase() : "";
  const currentDomain =
    typeof window !== "undefined" && window.location.hostname
      ? window.location.hostname
      : "localhost";

  if (
    error instanceof Error &&
    error.message.includes("Firebase auth is not configured")
  ) {
    return t("auth.errorFirebaseNotConfigured");
  }

  if (message.includes("resource-not-found")) {
    return t("auth.errorAuthConfigurationMissing");
  }

  if (message.includes("unexpected number in json")) {
    return t("auth.errorPopupBlocked");
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
      return t("auth.errorUnauthorizedDomain", { domain: currentDomain });
    case "auth/operation-not-allowed":
      return t("auth.errorProviderDisabled");
    case "auth/configuration-not-found":
      return t("auth.errorAuthConfigurationMissing");
    case "auth/internal-error":
      return message.includes("resource-not-found")
        ? t("auth.errorAuthConfigurationMissing")
        : t("auth.errorGeneral");
    case "auth/network-request-failed":
      return t("auth.errorNetwork");
    case "auth/invalid-api-key":
      return t("auth.errorInvalidApiKey");
    case "auth/account-exists-with-different-credential":
      return t("auth.errorAccountExists");
    case "auth/too-many-requests":
      return t("auth.errorTooManyRequests");
    default:
      return code
        ? `${t("auth.errorGeneral")} (${code})`
        : t("auth.errorGeneral");
  }
}
