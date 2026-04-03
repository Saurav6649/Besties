import { createContext } from "react";

export interface SessionType {
  id: string;
  fullname: string;
  email: string;
  mobile: string;
  image: string;
  iat: number;
}

interface AuthContextType {
  session: SessionType | null | false;
  setSession: (value: SessionType | null | false) => void;
}

const Context = createContext<AuthContextType>({
  session: null,
  setSession: () => {},
});

export default Context;
