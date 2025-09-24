import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store';

export const useAuthHydrated = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Force a re-render after hydration
    const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
      // After hydration, check if we have a token but no auth state
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        const currentState = useAuthStore.getState();
        
        if (token && !currentState.isAuthenticated) {
          // We have a token but not authenticated, restore state
          const { setAuthToken } = require('@/lib/api');
          setAuthToken(token);
          useAuthStore.setState({ isAuthenticated: true });
        } else if (!token && currentState.isAuthenticated) {
          // No token but marked as authenticated, clear state
          useAuthStore.getState().logout();
        }
      }
      setIsHydrated(true);
    });

    // If already hydrated, set immediately and check token
    if (useAuthStore.persist.hasHydrated()) {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        const currentState = useAuthStore.getState();
        
        if (token && !currentState.isAuthenticated) {
          const { setAuthToken } = require('@/lib/api');
          setAuthToken(token);
          useAuthStore.setState({ isAuthenticated: true });
        }
      }
      setIsHydrated(true);
    }

    return unsubscribe;
  }, []);

  return {
    isHydrated,
    user,
    isAuthenticated: isAuthenticated || (typeof window !== 'undefined' && !!localStorage.getItem('auth_token')),
  };
};