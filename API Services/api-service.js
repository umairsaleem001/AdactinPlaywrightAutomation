export const API_BASE_URL = 'https://api-testing-postman.vercel.app/api/v1';

export async function readResponseBody(response) {
  const body = await response.text();

  try {
    return JSON.parse(body);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return body;
    }
    throw error;
  }
}

export class ApiService 
{
  constructor(request) 
  {
    this.request = request;
  }

  get(path, options) 
  {
    return this.request.get(`${API_BASE_URL}${path}`, options);
  }

  post(path, options) 
  {
    return this.request.post(`${API_BASE_URL}${path}`, options);
  }

  put(path, options) 
  {
    return this.request.put(`${API_BASE_URL}${path}`, options);
  }

  delete(path, options) 
  {
    return this.request.delete(`${API_BASE_URL}${path}`, options);
  }
}
