import { RefreshCw } from 'lucide-react';

interface TopNavProps {
  isLiveBackend: boolean;
  onRefresh: () => void;
  isLoading: boolean;
}

export const TopNav = ({
  isLiveBackend,
  onRefresh,
  isLoading,
}: TopNavProps) => {
  return (
    <header className="w-full flex items-center justify-between py-4 px-1 select-none">
      {/* Brand & Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-2xl bg-[#1A4A35] flex items-center justify-center shadow-md shadow-[#1A4A35]/25 border border-[#2D6C4B]/40 overflow-hidden relative group shrink-0">
          <img
            src="/assets/mascot/app_icon.png"
            alt="DO-do List Icon"
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-xl font-extrabold tracking-tight text-[#15241B]">
              DO-do List
            </h1>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-[#E8EFE9] text-[#1E5338]">
              Daily
            </span>
          </div>
          <p className="text-[11px] font-semibold text-[#8A9A8F] leading-none mt-0.5 flex items-center gap-1.5">
            <span className="text-[#2C6246] font-bold">Plan. Organise. DO.</span>
          </p>
        </div>
      </div>

      {/* Right controls: Backend Status Pill & Refresh */}
      <div className="flex items-center gap-2">
        <div
          title={isLiveBackend ? 'Connected to FastAPI backend (:8000)' : 'Running on Local Storage (FastAPI offline)'}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
            isLiveBackend
              ? 'bg-[#EBF3ED] text-[#1E5338] border-[#CADBD0]'
              : 'bg-[#FAF9F4] text-[#8A9A8F] border-[#E2EAE4]'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isLiveBackend ? 'bg-[#299157] animate-pulse' : 'bg-[#D1DDD5]'
            }`}
          />
          <span className="text-[11px] font-semibold">
            {isLiveBackend ? 'FastAPI Live' : 'Local Mode'}
          </span>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          title="Refresh tasks"
          aria-label="Refresh tasks"
          className="p-1.5 rounded-full text-[#8A9A8F] hover:text-[#15241B] hover:bg-white active:scale-95 transition-all border border-transparent hover:border-[#E2EAE4]"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#1E5338]' : ''}`} />
        </button>
      </div>
    </header>
  );
};
