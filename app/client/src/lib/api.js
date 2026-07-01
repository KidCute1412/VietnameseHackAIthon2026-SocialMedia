// API client for HypeRoom
export async function apiRequest(url, options = {}) {
  const defaults = {
    headers: {},
  };

  const headers = { ...defaults.headers, ...options.headers };

  // For FormData, let the browser set the content-type header (including the boundary)
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const fetchOptions = {
    ...options,
    headers,
  };

  if (options.body && !(options.body instanceof FormData)) {
    fetchOptions.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, fetchOptions);

  if (response.status === 401) {
    window.dispatchEvent(new CustomEvent('hyperoom:unauthorized'));
  }

  if (!response.ok) {
    let errorMessage = `API error: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData?.detail?.message) {
        errorMessage = errorData.detail.message;
      } else if (errorData?.detail?.code) {
        errorMessage = errorData.detail.code;
      }
    } catch {
      // ignore
    }
    throw new Error(errorMessage);
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
}

export const authApi = {
  login: async ({ email, password }) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
  },
  register: async ({ email, password }) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: { email, password },
    });
  },
  logout: async () => {
    return apiRequest('/auth/logout', {
      method: 'POST',
    });
  },
  me: async () => {
    return apiRequest('/auth/me', {
      method: 'GET',
    });
  },
  forgotPassword: async ({ email }) => {
    return apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: { email },
    });
  },
  verifyOtp: async ({ email, otp }) => {
    return apiRequest('/auth/verify-otp', {
      method: 'POST',
      body: { email, otp },
    });
  },
  resetPassword: async ({ email, otp, new_password }) => {
    return apiRequest('/auth/reset-password', {
      method: 'POST',
      body: { email, otp, new_password },
    });
  },
};
