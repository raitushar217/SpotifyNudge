import { useAppState } from "../context/AppStateContext";

export default function ToastNotification() {
  const { toastMessage } = useAppState();

  return (
    <div
      id="toast-notification-container"
      className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-300 ease-out flex items-center justify-center ${
        toastMessage
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-3 scale-95"
      }`}
    >
      <div
        className="px-6 py-3 rounded-full bg-[#181818] text-white text-xs font-bold shadow-[0_12px_32px_rgba(0,0,0,0.6)] border border-white/10 flex items-center gap-2 whitespace-nowrap"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]" />
        {toastMessage}
      </div>
    </div>
  );
}
