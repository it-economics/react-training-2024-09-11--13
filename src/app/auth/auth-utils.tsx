import sha256 from 'crypto-js/sha256';
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://qdw00908-9000.euw.devtunnels.ms';

interface LoginResponse {
  token: string;
}

const login = (email: string, password: string) =>
  fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { authorization: generateAuthHeader(email, password) },
  })
    .then((response) => response.json() as unknown as LoginResponse)
    .then((response) => response.token)
    .catch((err) => console.error(err));

export const useLogin = (loggedIn: VoidFunction) => {
  const navigate = useNavigate();
  return (email: string, password: string) =>
    login(email, password)
      .then((token) => {
        if (token) storeToken(token);
        loggedIn();
        const deepLink = getDeepLink();
        if (deepLink) {
          return navigate(deepLink);
        }
        navigate('/home');
      })
      .catch((err) => console.error(err));
};

const generateAuthHeader = (email: string, password: string) => {
  return `Basic ${email}:${sha256(password)}`;
};

const register = (email: string, password: string) =>
  fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { authorization: generateAuthHeader(email, password) },
  }).catch((err) => console.error(err));

export const useRegister = () => {
  const navigate = useNavigate();
  return (email: string, password: string) =>
    register(email, password)
      .then(() => navigate('/login'))
      .catch((err) => console.error(err));
};

const TOKEN_KEY = 'secret-token';

const storeToken = (token: string) =>
  window.localStorage.setItem(TOKEN_KEY, token);

export const getToken = () => window.localStorage.getItem(TOKEN_KEY);

export const invalidateToken = () => window.localStorage.removeItem(TOKEN_KEY);

const DEEP_LINK_KEY = 'deep-link';

export const storeDeepLink = (deepLink: string) =>
  window.localStorage.setItem(DEEP_LINK_KEY, deepLink);

export const getDeepLink = () => {
  const deepLink = window.localStorage.getItem(DEEP_LINK_KEY);
  window.localStorage.removeItem(DEEP_LINK_KEY);
  return deepLink;
};
