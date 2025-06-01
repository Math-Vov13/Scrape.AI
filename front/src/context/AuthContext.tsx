'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type AuthContextType = {
  user: any;
  isAdmin: boolean;
  loading?: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  loading: true,
  login: async () => true,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

import { PropsWithChildren } from 'react';

export const AuthProvider = ({ children }: PropsWithChildren<{}>) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
      setIsAdmin(JSON.parse(stored).admin || false);
    }
    setLoading(false);
  }, []);

  const login = async (email: any, password: any) => {
    try {
      logout(); // Déconnexion avant de se reconnecter

      if (!email || !password) {
        throw new Error('Email et mot de passe requis');
      }

      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error('Échec de connexion');

      const data = await res.json();
      console.log('Réponse de l\'API:', data);
      if (!data.user) {
        throw new Error('Internal Error !');
      }

      setUser(data.user);
      setIsAdmin(data.user.admin || false);
      localStorage.setItem('user', JSON.stringify(data.user));
      console.log('Utilisateur connecté:', data.user);
      return true;

    } catch (err) {
      if (err instanceof Error) {
        console.log('Connexion échouée : ' + err.message);
      } else {
        console.log('Connexion échouée');
      }
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
