import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { DodoMascot } from './DodoMascot';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
  mascotMood?: 'running' | 'idea' | 'sleeping' | 'checklist';
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast = ({ toasts, onDismiss }: ToastProps) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl shadow-xl border text-xs font-semibold animate-in slide-in-from-top-3 duration-200 select-none ${
            toast.type === 'success'
              ? 'bg-[#1E5338] text-white border-[#2A6E4B]'
              : toast.type === 'error'
              ? 'bg-[#D94F4F] text-white border-[#BE3C3C]'
              : 'bg-white text-[#15241B] border-[#E2EAE4]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {toast.mascotMood ? (
              <div className="w-8 h-8 shrink-0 bg-white/20 rounded-xl flex items-center justify-center p-0.5 overflow-hidden">
                <DodoMascot mood={toast.mascotMood} size={30} />
              </div>
            ) : (
              <>
                {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#A7E2BE]" />}
                {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-white" />}
                {toast.type === 'info' && <Info className="w-4 h-4 text-[#1E5338]" />}
              </>
            )}
            <span>{toast.text}</span>
          </div>
          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            className="p-1 rounded-full hover:bg-black/10 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
