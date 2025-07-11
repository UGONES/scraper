import jwtDecode from 'jwt-decode';

export const getStoredAuth = () => {
  try {
    const raw = localStorage.getItem('scraperAuth');
    if (!raw) return null;

    const data = JSON.parse(raw);
    const decoded = jwtDecode(data.token);

    // Token expired?
    if (decoded.exp * 1000 < Date.now()) {
      clearStoredAuth();
      return null;
    }

    return data;
  } catch (err) {
  clearStoredAuth();
  return null;
}

};

export const setStoredAuth = (data) => {
  localStorage.setItem('scraperAuth', JSON.stringify(data));
};

export const clearStoredAuth = () => {
  localStorage.removeItem('scraperAuth');
};
