const API_BASE_URL = 'http://localhost:3001/v1';

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = 'An error occurred';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      errorMessage = response.statusText;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export const authAPI = {
  login: async (credentials: any) => {
    return fetchWithAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
  register: async (data: any) => {
    return fetchWithAuth('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  getMe: async () => {
    return fetchWithAuth('/auth/me', {
      method: 'GET',
    });
  },
};

export const decksAPI = {
  getAll: async () => {
    return fetchWithAuth('/decks', {
      method: 'GET',
    });
  },
  getById: async (id: string) => {
    return fetchWithAuth(`/decks/${id}`, {
      method: 'GET',
    });
  },
  create: async (data: any) => {
    return fetchWithAuth('/decks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  update: async (id: string, data: any) => {
    return fetchWithAuth(`/decks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};

export const deckCardsAPI = {
  getByDeckId: async (deckId: string) => {
    return fetchWithAuth(`/decks/${deckId}/cards`, {
      method: 'GET',
    });
  },
};

export const cardsAPI = {
  getAll: async () => {
    return fetchWithAuth('/cards', {
      method: 'GET',
    });
  },
  getById: async (id: string) => {
    return fetchWithAuth(`/cards/${id}`, {
      method: 'GET',
    });
  },
  create: async (data: any) => {
    return fetchWithAuth('/cards', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  bulkCreate: async (data: any) => {
    return fetchWithAuth('/cards/bulk', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  update: async (id: string, data: any) => {
    return fetchWithAuth(`/cards/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
  delete: async (id: string) => {
    return fetchWithAuth(`/cards/${id}`, {
      method: 'DELETE',
    });
  },
};
