/** Extract a user-visible message from an axios-style API error. */
export function apiErrorMessage(error, fallback) {
  const d = error?.response?.data;
  if (typeof d?.detail === "string" && d.detail) return d.detail;
  if (Array.isArray(d?.non_field_errors) && d.non_field_errors[0]) {
    return String(d.non_field_errors[0]);
  }
  return error?.message || fallback;
}
