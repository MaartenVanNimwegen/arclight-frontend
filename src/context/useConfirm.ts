import { useContext } from "react";
import { ConfirmContext } from "./confirm-context";

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context)
    throw new Error("useConfirm moet binnen ConfirmProvider gebruikt worden");
  return context;
}
