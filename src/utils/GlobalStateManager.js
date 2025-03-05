// src/utils/GlobalStateManager.js
import { useEffect, useState } from 'react';

// This creates a simple, global event system that any component can subscribe to
export const GlobalStateManager = {
  _listeners: new Map(),
  
  // Subscribe to a state change
  subscribe: (key, callback) => {
    if (!GlobalStateManager._listeners.has(key)) {
      GlobalStateManager._listeners.set(key, new Set());
    }
    GlobalStateManager._listeners.get(key).add(callback);
    
    // Return unsubscribe function
    return () => {
      const listeners = GlobalStateManager._listeners.get(key);
      if (listeners) {
        listeners.delete(callback);
      }
    };
  },
  
  // Update global state
  update: (key, value) => {
    const listeners = GlobalStateManager._listeners.get(key);
    if (listeners) {
      listeners.forEach(callback => callback(value));
    }
  }
};

// Add a specific auth state key
export const AUTH_STATE_CHANGED = 'authStateChanged';

// Create a hook to subscribe to auth state changes
export const useGlobalAuthState = () => {
  const [forceUpdate, setForceUpdate] = useState(0);
  
  useEffect(() => {
    const unsubscribe = GlobalStateManager.subscribe(AUTH_STATE_CHANGED, () => {
      // Force component to re-render
      setForceUpdate(prev => prev + 1);
    });
    
    return unsubscribe;
  }, []);
  
  return forceUpdate;
};

export default GlobalStateManager;