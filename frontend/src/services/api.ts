const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  token?: string;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  if (!response.ok) {
    throw new Error(`Erro da API: ${response.status}`);
  }

  return (await response.json()) as T;
}

export const api = {
  health: () => request<{ status: string }>('/health'),
  login: (payload: { email: string; password: string }) =>
    request<{ token: string; user: { id: string; role: string } }>('/auth/login', {
      method: 'POST',
      body: payload
    }),
  categories: () => request<{ categories: Array<{ id: string; name: string }> }>('/catalog/categories'),
  products: () =>
    request<{ products: Array<{ id: string; name: string; price: number; categoryId: string }> }>(
      '/catalog/products'
    ),
  createOrder: (payload: { items: Array<{ productId: string; quantity: number }> }, token: string) =>
    request<{ orderId: string; status: string }>('/orders', {
      method: 'POST',
      body: payload,
      token
    })
};
