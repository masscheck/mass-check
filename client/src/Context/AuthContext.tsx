import React, { useContext, useState, useEffect } from 'react';

import {
  auth,
  googleProvider,
  twitterProvider,
} from '../Util/Firebase/FirebaseConfig';

type AuthContextType = {
  signUp: (email: string, password: string, username: string) => Promise<any>;
  emailSignIn: (email: string, password: string) => Promise<any>;
  googleSignIn: () => Promise<any>;
  twitterSignIn: () => Promise<any>;
  signOut: () => void;
  resetPassword: (email: string) => any;
};

const AuthContext = React.createContext<Partial<AuthContextType>>({});

const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider: React.FC = ({ children }) => {
  const signUp = (email: string, password: string, username: string) => {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await auth.createUserWithEmailAndPassword(
          email,
          password
        );
        const {
          user: { uid },
        } = result;
        resolve(uid);
      } catch (err) {
        reject(err);
      }
    });
  };

  const emailSignIn = (email: string, password: string) => {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await auth.signInWithEmailAndPassword(email, password);

        const {
          additionalUserInfo: { isNewUser },
          user: { uid },
        } = result;

        resolve({ uid, isNewUser });
      } catch (err) {
        reject(err);
      }
    });
  };

  const googleSignIn = async () => {
    googleProvider.setCustomParameters({ prompt: 'select_account' });
    return externalMethodSignIn(googleProvider);
  };

  const twitterSignIn = async () => {
    return externalMethodSignIn(twitterProvider);
  };

  const externalMethodSignIn = (provider: any) => {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await auth.signInWithPopup(provider);

        const {
          user: { uid, email, displayName },
          additionalUserInfo: { isNewUser },
        } = result;

        resolve({
          uid,
          email,
          isNewUser,
          username: displayName,
        });
      } catch (err) {
        reject(err);
      }
    });
  };

  const signOut = async () => {
    return auth.signOut();
  };

  const resetPassword = async (email: string) => {
    try {
      await auth.sendPasswordResetEmail(email);
    } catch (err) {
      throw err;
    }
  };

  const value = {
    emailSignIn,
    googleSignIn,
    twitterSignIn,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { useAuth, AuthProvider };
