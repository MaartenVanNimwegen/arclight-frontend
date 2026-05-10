import { createContext } from "react";

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  isDanger?: boolean;
}

export interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

export const ConfirmContext = createContext<ConfirmContextType | undefined>(
  undefined,
);
