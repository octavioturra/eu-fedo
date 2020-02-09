import * as React from "react";
import { authenticate, isAuthValidForPollId } from "./PollEncryptions";
import { AuthPair } from "./_DSL";
import { LoginError } from "./ErrorBoundaryLogin";

interface Context {
  authenticated: boolean;
  authData: AuthData;
  setAuthData: (username: string, password: string) => void;
}
interface AuthData {
  username: string | null;
  password: string | null;
}

const context: Context = {
  authenticated: false,
  authData: {
    username: null,
    password: null
  },
  setAuthData(username: string, password: string) {
    this.authenticated = true;
    this.authData = {
      username,
      password
    };
  }
};

const { useContext, createContext } = React;

export const authContext = createContext(context);

export function AuthContext({ children }: { children: React.ReactNode }) {
  return React.createElement(authContext.Provider, {
    children,
    value: context
  });
}

interface UseLoginOutput {
  authData: AuthData;
  login: (username: string, password: string) => Promise<boolean>;
  checkAuthenticated: () => void;
  setLogin: (username: string, password: string) => void;
}

export function useAuth() {
  const context = useContext(authContext);
  return function(username: string, password: string) {
    context.setAuthData(username, password);
  };
}

export default function(pollId: string): UseLoginOutput {
  async function login(username: string, password: string): Promise<boolean> {
    const auth = new AuthPair(username, password);
    await authenticate(auth);
    await isAuthValidForPollId(pollId, auth);
    context.setAuthData(username, password);
    return true;
  }

  function checkAuthenticated() {
    if (!context.authenticated) {
      throw new LoginError("Usuário não autenticado", pollId);
    }
  }

  function setLogin(username: string, password: string) {}

  return {
    authData: context.authData,
    login,
    checkAuthenticated,
    setLogin
  };
}
