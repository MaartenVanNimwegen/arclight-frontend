import { createContext, useContext, useState, type ReactNode } from "react";

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  isDanger?: boolean;
}

interface ConfirmContextType {
  // Dit is de magische functie die een Promise (true of false) teruggeeft
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    options: ConfirmOptions;
    resolve: ((value: boolean) => void) | null;
  }>({
    isOpen: false,
    options: {
      title: "",
      message: "",
      confirmText: "Bevestigen",
      isDanger: true,
    },
    resolve: null,
  });

  const confirm = (options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setModalState({
        isOpen: true,
        options: { confirmText: "Bevestigen", isDanger: true, ...options },
        resolve, // Bewaar de resolve functie om hem later aan te roepen
      });
    });
  };

  const handleConfirm = () => {
    if (modalState.resolve) modalState.resolve(true);
    closeModal();
  };

  const handleCancel = () => {
    if (modalState.resolve) modalState.resolve(false);
    closeModal();
  };

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      {/* De Globale Modal die altijd bovenaan de DOM leeft */}
      {modalState.isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200 text-center">
            <div
              className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6 text-2xl ${modalState.options.isDanger ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-500"}`}
            >
              {modalState.options.isDanger ? "⚠️" : "❓"}
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              {modalState.options.title}
            </h2>
            <p className="text-slate-500 mb-8 text-sm">
              {modalState.options.message}
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Annuleren
              </button>
              <button
                onClick={handleConfirm}
                className={`flex-1 px-4 py-3 rounded-xl font-bold text-white shadow-md transition-all active:scale-95 ${
                  modalState.options.isDanger
                    ? "bg-red-500 hover:bg-red-600 shadow-red-200"
                    : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
                }`}
              >
                {modalState.options.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context)
    throw new Error("useConfirm moet binnen ConfirmProvider gebruikt worden");
  return context;
};
