import { useCallback, useMemo } from 'react';
import type { User } from '../types';
import { useLocalStorage } from './useLocalStorage';

const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_USER_KEY = 'auth_user';

export function useAuth() {
  const [token, setToken] = useLocalStorage<string | null>(AUTH_TOKEN_KEY, null);
  const [user, setUser] = useLocalStorage<User | null>(AUTH_USER_KEY, null);

  const login = useCallback(
    (nextToken: string, nextUser: User) => {
      setToken(nextToken);
      setUser(nextUser);
    },
    [setToken, setUser],
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, [setToken, setUser]);

  return useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [token, user, login, logout],
  );
}
