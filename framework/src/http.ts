export type HttpResult<T = any> = T | string;

async function parseResponse<T = any>(res: Response): Promise<HttpResult<T>> {
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} ${res.statusText} ${text}`);
  }
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    return res.json() as Promise<T>;
  }
  try {
    return (await res.json()) as T;
  } catch (_) {
    return (await res.text()) as string;
  }
}

type HttpMethods = {
  request<T = any>(url: string, options?: RequestInit): Promise<HttpResult<T>>;
  get<T = any>(url: string, options?: RequestInit): Promise<HttpResult<T>>;
  post<T = any>(url: string, data?: any, options?: RequestInit): Promise<HttpResult<T>>;
  put<T = any>(url: string, data?: any, options?: RequestInit): Promise<HttpResult<T>>;
  del<T = any>(url: string, options?: RequestInit): Promise<HttpResult<T>>;
  safe<T = any>(url: string, options?: RequestInit): Promise<
    { ok: true; body: HttpResult<T> } | { ok: false; error: Error }
  >;
};

export const http: HttpMethods = {
  async request<T = any>(url: string, options: RequestInit = {}): Promise<HttpResult<T>> {
    const res = await fetch(url, options);
    return parseResponse<T>(res);
  },

  get<T = any>(url: string, options: RequestInit = {}): Promise<HttpResult<T>> {
    return http.request<T>(url, { method: 'GET', ...options });
  },

  post<T = any>(url: string, data?: any, options: RequestInit = {}): Promise<HttpResult<T>> {
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) } as Record<string, string>;
    return http.request<T>(url, { method: 'POST', headers, body: JSON.stringify(data), ...options });
  },

  put<T = any>(url: string, data?: any, options: RequestInit = {}): Promise<HttpResult<T>> {
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) } as Record<string, string>;
    return http.request<T>(url, { method: 'PUT', headers, body: JSON.stringify(data), ...options });
  },

  del<T = any>(url: string, options: RequestInit = {}): Promise<HttpResult<T>> {
    return http.request<T>(url, { method: 'DELETE', ...options });
  },

  async safe<T = any>(url: string, options: RequestInit = {}): Promise<{ ok: true; body: HttpResult<T> } | { ok: false; error: Error }> {
    try {
      const body = await http.request<T>(url, options);
      return { ok: true, body };
    } catch (err) {
      return { ok: false, error: err as Error };
    }
  }
};
