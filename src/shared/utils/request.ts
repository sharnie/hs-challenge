type Method = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export type RequestType = {
  headers?: any;
  body?: any;
};

export const verifyResponse = (response: Response) => {
  if (!response.ok) {
    throw new Error(`Error fetching event data: ${response.statusText}`);
  }
  return response;
};

export const toJSON = (response: Response) => response.json();

export const handleError = async (error: Response) => await error.json();

export const request = (method: Method, url: string, options?: RequestType) =>
  fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

export const get = async (url: string, options?: RequestType) =>
  request('GET', url, options);

export const post = async (url: string, options?: RequestType) =>
  request('POST', url, options);

export const patch = async (url: string, options?: RequestType) =>
  request('PATCH', url, options);

export const put = async (url: string, options?: RequestType) =>
  request('PUT', url, options);

export const del = async (url: string, options?: RequestType) =>
  request('DELETE', url, options);
