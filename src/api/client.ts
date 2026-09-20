const BASE_URL = import.meta.env.VITE_API_URL || "/api/v1";

let authToken: string | null = localStorage.getItem('token');

export const apiClient = {
  setToken: (token: string | null) => {
    authToken = token;
  },
  
  get: async (endpoint: string) => {
    const headers: any = {};
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
    
    const response = await fetch(`${BASE_URL}${endpoint}`, { headers });
    if (!response.ok) {
        if (response.status === 403) throw new Error('Permission Denied');
        throw new Error('Network error');
    }
    return response.json();
  },
  
  post: async (endpoint: string, data: any, isUrlEncoded: boolean = false) => {
    const headers: any = {};
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
    
    let body;
    if (isUrlEncoded) {
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
        body = new URLSearchParams(data).toString();
    } else {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(data);
    }
    
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body
    });
    if (!response.ok) throw new Error('Network error');
    return response.json();
  },
  
  patch: async (endpoint: string, data: any) => {
    const headers: any = {
      'Content-Type': 'application/json'
    };
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
    
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Network error');
    return response.json();
  }
};
