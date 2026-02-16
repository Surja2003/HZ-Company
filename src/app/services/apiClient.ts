export type ApiError = {
  message: string;
  status?: number;
  details?: unknown;
};

function getBaseUrl() {
  const base = (import.meta as any).env?.VITE_API_BASE_URL as string | undefined;
  return base?.replace(/\/$/, "") ?? "";
}

async function parseJsonSafe(response: Response) {
  const text = await response.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function postJson<TRequest extends Record<string, unknown>, TResponse>(
  path: string,
  body: TRequest,
  options?: { signal?: AbortSignal }
): Promise<TResponse> {
  const response = await fetch(`${getBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
    signal: options?.signal,
  });

  if (!response.ok) {
    const details = await parseJsonSafe(response);
    const error: ApiError = {
      message:
        typeof details === "object" && details
          ? ("message" in (details as any)
              ? String((details as any).message)
              : "error" in (details as any)
                ? String((details as any).error)
                : `Request failed (${response.status})`)
          : `Request failed (${response.status})`,
      status: response.status,
      details,
    };
    throw error;
  }

  const json = (await parseJsonSafe(response)) as TResponse;
  return json;
}
