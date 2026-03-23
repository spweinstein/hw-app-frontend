export const EXPLORE_LIST_PAGE_SIZE = 10;

export const VALID_EXPLORE_TABS = ["exercises", "templates", "plans"];

export function parsePageParam(raw) {
  const n = Number.parseInt(String(raw ?? "1"), 10);
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

export function parseTabParam(raw) {
  const t = String(raw ?? "").toLowerCase();
  return VALID_EXPLORE_TABS.includes(t) ? t : "exercises";
}

export function matchesSearch(query, parts) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return parts.some((p) => String(p ?? "").toLowerCase().includes(q));
}

export function paginateSlice(items, page, pageSize) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize) || 1);
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    slice: items.slice(start, start + pageSize),
    totalPages,
    safePage,
  };
}
