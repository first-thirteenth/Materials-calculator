type ErrorWithCode = {
  code?: unknown;
  message?: unknown;
  customData?: unknown;
};

function getErrorCode(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as ErrorWithCode).code === "string"
  ) {
    return (error as ErrorWithCode).code;
  }

  return "";
}

function getErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as ErrorWithCode).message === "string"
  ) {
    return (error as ErrorWithCode).message;
  }

  return "";
}

function isAuthDebugEnabled() {
  if (import.meta.env.DEV) {
    return true;
  }

  const params = new URLSearchParams(window.location.search);
  return params.get("debugAuth") === "1";
}

export function logAuthDebug(step: string, error: unknown) {
  if (!isAuthDebugEnabled()) {
    return;
  }

  const code = getErrorCode(error);
  const message = getErrorMessage(error);

  console.groupCollapsed(`[Auth][Debug] ${step}${code ? ` (${code})` : ""}`);
  console.info("origin", window.location.origin);
  console.info("path", `${window.location.pathname}${window.location.search}`);
  console.info("code", code || "(none)");
  console.info("message", message || "(none)");

  if (
    typeof error === "object" &&
    error !== null &&
    "customData" in error &&
    typeof (error as ErrorWithCode).customData === "object"
  ) {
    console.info("customData", (error as ErrorWithCode).customData);
  }

  console.error(error);
  console.groupEnd();
}
