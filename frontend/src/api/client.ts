/**
 * CustomerIQ Centralized API Client
 * Manages connection, headers, error handling, and API base URL configuration.
 */

const STORAGE_KEY = 'customeriq_api_base_url';

export function getStoredApiUrl(): string {
  if (typeof window !== 'undefined') {
    const customUrl = localStorage.getItem(STORAGE_KEY);
    if (customUrl) return customUrl.trim();
  }
  return (import.meta.env.VITE_API_BASE_URL || '').trim();
}

export function setStoredApiUrl(url: string): void {
  if (typeof window !== 'undefined') {
    if (url.trim()) {
      localStorage.setItem(STORAGE_KEY, url.trim().replace(/\/+$/, ''));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
}

export class ApiError extends Error {
  status?: number;
  kind: 'offline' | 'validation' | 'not_found' | 'server' | 'unknown';

  constructor(message: string, kind: 'offline' | 'validation' | 'not_found' | 'server' | 'unknown', status?: number) {
    super(message);
    this.name = 'ApiError';
    this.kind = kind;
    this.status = status;
  }
}

export async function apiClient<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = getStoredApiUrl();

  if (!baseUrl) {
    throw new ApiError(
      'CustomerIQ API is currently unavailable.',
      'offline'
    );
  }

  const cleanBase = baseUrl.replace(/\/+$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const fullUrl = `${cleanBase}${cleanPath}`;

  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && options.body && typeof options.body === 'string') {
    headers.set('Content-Type', 'application/json');
  }
  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  const controller = new AbortController();
  const timeoutMs = 15000;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers,
      signal: options.signal || controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorDetail = '';
      try {
        const errorJson = await response.json();
        errorDetail = errorJson.detail || errorJson.message || '';
      } catch {
        // Not JSON
      }

      if (response.status === 404) {
        throw new ApiError('No customer intelligence profile was found.', 'not_found', 404);
      }

      if (response.status === 422 || response.status === 400) {
        throw new ApiError(
          errorDetail ? `Please check the customer information and try again: ${errorDetail}` : 'Please check the customer information and try again.',
          'validation',
          response.status
        );
      }

      if (response.status >= 500) {
        throw new ApiError('Something went wrong while analyzing this customer.', 'server', response.status);
      }

      throw new ApiError(
        errorDetail || 'Something went wrong while analyzing this customer.',
        'unknown',
        response.status
      );
    }

    const data = await response.json();
    return data as T;
  } catch (err: unknown) {
    clearTimeout(timeoutId);

    if (err instanceof ApiError) {
      throw err;
    }

    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError('CustomerIQ API request timed out. Please try again.', 'offline');
    }

    // Network error / CORS / unreachable Railway container
    throw new ApiError('CustomerIQ API is currently unavailable.', 'offline');
  }
}
