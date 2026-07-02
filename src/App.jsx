import { Routes, Route } from "react-router";
import TopBar from "./components/TopBar";
import Sidebar from "./components/Sidebar";
import HomeScreen from "./components/HomeScreen";
import PlaylistView from "./components/PlaylistView";
import BreakYourLoopScreen from "./components/BreakYourLoopScreen";
import TasteCirclesView from "./components/TasteCirclesView";
import RightPanel from "./components/RightPanel";
import RepeatBehaviorBanner from "./components/RepeatBehaviorBanner";
import EndOfPlaylistModal from "./components/EndOfPlaylistModal";
import DiscoveryBreakModal from "./components/DiscoveryBreakModal";
import BottomPlayerBar from "./components/BottomPlayerBar";
import ToastNotification from "./components/ToastNotification";
import { useAppState } from "./context/AppStateContext";

export default function App() {
  const { aiError, setAiError, isLoadingAI, nudgeCards } = useAppState();

  const isFirstLoad = isLoadingAI && (!nudgeCards || nudgeCards.length === 0);

  if (isFirstLoad) {
    return (
      <div
        className="w-screen h-screen flex flex-col items-center justify-center text-center select-none"
        style={{ background: "#121212" }}
      >
        <div className="flex flex-col items-center gap-6 animate-pulse">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: "radial-gradient(circle, #1DB954 0%, transparent 70%)", filter: "blur(2px)" }}
          >
            <div className="w-4 h-4 rounded-full bg-[#1DB954]" />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-white text-xl font-bold tracking-tight">Analyzing your music taste...</h2>
            <p className="text-[#A7A7A7] text-xs max-w-[280px]">
              Retrieving live listening patterns and synthesizing stepping stones via Groq Llama AI
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full h-screen flex flex-col overflow-hidden"
      style={{ background: "#121212", fontFamily: "'Inter', -apple-system, sans-serif" }}
    >
      {/* Top bar */}
      <TopBar />

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left sidebar */}
        <Sidebar />

        {/* Center content — routed views */}
        <div className="flex-1 overflow-hidden flex flex-col relative" style={{ background: "#121212" }}>
          {aiError && (
            <div
              id="ai-error-banner"
              className="flex-shrink-0 bg-red-950/40 border-b border-red-500/20 px-4 py-2.5 flex items-center justify-between text-xs text-red-300 font-semibold"
            >
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span>Using fallback recommendations: {aiError}</span>
              </div>
              <button
                id="ai-error-banner-dismiss-btn"
                onClick={() => setAiError(null)}
                className="text-red-400 hover:text-red-200 font-bold text-sm px-1.5 h-6 w-6 flex items-center justify-center rounded-full hover:bg-white/5 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                ×
              </button>
            </div>
          )}
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/playlist/demo" element={<PlaylistView />} />
            <Route path="/break-your-loop" element={<BreakYourLoopScreen />} />
            <Route path="/taste-circles" element={<TasteCirclesView />} />
          </Routes>
        </div>

        {/* Right contextual panel — route-aware */}
        <RightPanel />

        {/* End-of-playlist modal overlay */}
        <EndOfPlaylistModal />

        {/* Discovery Break modal overlay */}
        <DiscoveryBreakModal />
      </div>

      {/* Repeat behaviour nudge banner */}
      <RepeatBehaviorBanner />

      {/* Bottom player */}
      <BottomPlayerBar />

      {/* Toast notification system */}
      <ToastNotification />
    </div>
  );
}
