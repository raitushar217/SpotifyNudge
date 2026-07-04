import { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import {
  samplePlaylist,
  sampleQueue,
  sampleRepeatData,
} from "../data/samplePlaylist";
import {
  synthesizeTasteProfile,
  discoverSteppingStones,
  generateExplanation,
  simulateSaveRate,
  buildTasteCircleTracks,
  dedupeAgainstList,
  FALLBACK_TASTE_PROFILE,
  FALLBACK_NUDGE_CARDS,
  FALLBACK_TASTE_CIRCLE_TRACKS,
} from "../lib/aiPipeline";

// ─── Domain types ──────────────────────────────────────────────────────────────

/** A track from sampleQueue / samplePlaylist.tracks */
export interface SampleTrack {
  id: string;
  name: string;
  artist: string;
  album: string;
  dateAdded: string;
  duration: string;
}

/** A Taste-Circles track with AI-generated match fields */
export interface CircleTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  match: string;
  matchReason: string;
}

/** A Break-Your-Loop nudge card with AI-generated explanation */
export interface NudgeCard {
  id: string;
  title: string;
  artist: string;
  album: string;
  sourceTrack: string;
  explanation: string;
  saveRate: number;
  intensity: "Safe Step" | "Stretch" | "Leap";
}

export interface TasteProfile {
  tags: string[];
  coreArtists: string[];
}

export interface TasteCircle {
  name: string;
  listeners: string;
  artists: Array<{ name: string; initials: string; gradientFrom: string; gradientTo: string }>;
  trending: Array<{ title: string; artist: string; saveRate: number }>;
  tracks: CircleTrack[];
}

export interface RepeatData {
  artistName: string;
  count: number;
  branches: Array<{ name: string; thumbnailColor: string }>;
}

// ─── Context shape ─────────────────────────────────────────────────────────────

interface AppState {
  // Playlist / queue
  currentPlaylist: typeof samplePlaylist;
  currentQueue: SampleTrack[];
  currentTrack: SampleTrack;       // starts at queue[0]; never null after init
  isPlaying: boolean;

  // Song-count tracking
  songsPlayedCount: number;

  // UI flags
  shouldShowNudge: boolean;
  shouldShowEndOfPlaylist: boolean;
  shouldShowRepeatBanner: boolean;

  // Repeat-listening data (simulated; see samplePlaylist.js)
  repeatData: RepeatData;

  // ── AI-generated fields ────────────────────────────────────────────────────
  // TEMP PLACEHOLDER — replaced by real AI in Phase 4
  tasteProfile: TasteProfile;
  nudgeCards: NudgeCard[];
  tasteCircle: TasteCircle;
  tasteCircleTracks: CircleTrack[];   // convenience alias → tasteCircle.tracks

  // Phase 4 loading / error states
  isLoadingAI: boolean;
  aiError: string | null;

  // Saved-for-later
  savedForLater: SampleTrack[];

  // Toast system state
  toastMessage: string | null;

  // ── Playback actions ────────────────────────────────────────────────────────
  /**
   * Play a specific track (e.g. clicking a row in PlaylistView).
   * Sets currentTrack, isPlaying=true, increments songsPlayedCount,
   * and evaluates nudge / end-of-playlist triggers.
   */
  playTrack: (track: SampleTrack) => void;

  /**
   * Advance to the next track in sampleQueue.
   * - If on the last track → sets shouldShowEndOfPlaylist=true instead.
   * - Increments songsPlayedCount.
   * - After every 4 plays (count % 4 === 0 && count > 0) → shouldShowNudge=true.
   */
  playNext: () => void;

  /**
   * Go back to the previous track in sampleQueue.
   * Does nothing if already at index 0.
   */
  playPrev: () => void;

  /** Toggle isPlaying on/off */
  togglePlay: () => void;

  /** Play artist fallback track when chip in RepeatBehaviorBanner is clicked */
  playArtistFallback: (artist: string) => void;

  /** Trigger a toast message that auto-dismisses after 2 seconds */
  showToast: (message: string) => void;

  // ── Low-level setters (used by child components) ───────────────────────────
  setCurrentTrack: (t: SampleTrack) => void;
  setIsPlaying: (v: boolean) => void;
  setShouldShowEndOfPlaylist: (v: boolean) => void;
  setShouldShowRepeatBanner: (v: boolean) => void;
  setSongsPlayedCount: (v: number) => void;
  setShouldShowNudge: (v: boolean) => void;
  addToSavedForLater: (t: SampleTrack) => void;
  removeFromSavedForLater: (id: string) => void;
  appendToPlaylist: (t: SampleTrack) => void;
  setIsLoadingAI: (v: boolean) => void;
  setAiError: (v: string | null) => void;

  // Phase 4: AI result setters
  setTasteProfile: (v: TasteProfile) => void;
  setNudgeCards: (v: NudgeCard[]) => void;
  setTasteCircle: (v: TasteCircle) => void;
  regenerateAI: () => Promise<void>;
}

// ─── Context ───────────────────────────────────────────────────────────────────

const AppStateContext = createContext<AppState | null>(null);

// ─── Provider ──────────────────────────────────────────────────────────────────

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  // ── Queue reference ──────────────────────────────────────────────────────
  const queue: SampleTrack[] = sampleQueue;
  const lastIndex = queue.length - 1;

  // ── Playlist / playback ──────────────────────────────────────────────────
  const [currentPlaylist, setCurrentPlaylist] = useState(samplePlaylist);
  const [currentQueue, setCurrentQueue] = useState<SampleTrack[]>(queue);

  // Requirement 1: currentTrack = sampleQueue[0] on load
  const [currentTrack, setCurrentTrack] = useState<SampleTrack>(queue[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  // ── Counters & flags ─────────────────────────────────────────────────────
  const [songsPlayedCount, setSongsPlayedCount] = useState(0);
  const [shouldShowNudge, setShouldShowNudge] = useState(false);
  const [shouldShowEndOfPlaylist, setShouldShowEndOfPlaylist] = useState(false);

  // Requirement 5: shouldShowRepeatBanner starts true; X button sets false
  const [shouldShowRepeatBanner, setShouldShowRepeatBanner] = useState(true);

  // ── Repeat data (simulated) ───────────────────────────────────────────────
  const [repeatData] = useState<RepeatData>({
    artistName: sampleRepeatData.artistName,
    count: sampleRepeatData.count,
    branches: sampleRepeatData.branches,
  });

  // ── AI-generated fields (starts empty, populated on mount)
  const [tasteProfile, setTasteProfile] = useState<TasteProfile>({ tags: [], coreArtists: [] });
  const [nudgeCards, setNudgeCards] = useState<NudgeCard[]>([]);
  const [tasteCircle, setTasteCircle] = useState<TasteCircle>({
    name: "",
    listeners: "",
    artists: [],
    trending: [],
    tracks: [],
  });

  // ── Phase 4 loading / error ──────────────────────────────────────────────
  const [isLoadingAI, setIsLoadingAI] = useState(true);
  const [aiError, setAiError] = useState<string | null>(null);

  const runAIPipeline = useCallback(async (stagger = false) => {
    setIsLoadingAI(true);
    setAiError(null);

    try {
      // a. synthesizeTasteProfile
      const rawProfile = await synthesizeTasteProfile(currentPlaylist.tracks);

      const processedProfile: TasteProfile = {
        mood: rawProfile.mood,
        energy: rawProfile.energy,
        vocal_style: rawProfile.vocal_style,
        era: rawProfile.era,
        circle_name: rawProfile.circle_name,
        circle_emoji: rawProfile.circle_emoji,
        core_artists: rawProfile.core_artists,
        taste_tags: rawProfile.taste_tags,
        // compatibility fields
        tags: rawProfile.taste_tags || rawProfile.tags || [],
        coreArtists: rawProfile.core_artists || rawProfile.coreArtists || [],
      };

      // b. discoverSteppingStones
      const suggestions = await discoverSteppingStones(processedProfile, currentPlaylist.tracks);

      // c. explanations and save rates (parallel for initial load, staggered for regenerate)
      let builtNudgeCards: NudgeCard[] = [];
      if (stagger) {
        const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
        for (let idx = 0; idx < suggestions.length; idx++) {
          const s = suggestions[idx];
          if (idx > 0) await sleep(300);

          // lookup source track details
          const matchedSource = currentPlaylist.tracks.find(
            (t) => t.name.toLowerCase().trim() === s.sourceTrack.toLowerCase().trim()
          );
          const sourceName = matchedSource ? matchedSource.name : s.sourceTrack;
          const sourceArtist = matchedSource ? matchedSource.artist : "Unknown";

          const explanation = await generateExplanation(
            processedProfile,
            s.song_name,
            s.artist_name,
            sourceName,
            sourceArtist
          );

          const savePercent = simulateSaveRate(s.closeness);

          const mappedIntensity =
            s.closeness === "safe_step"
              ? "Safe Step"
              : s.closeness === "stretch"
              ? "Stretch"
              : "Leap";

          builtNudgeCards.push({
            id: `nudge-${idx}-${Date.now()}`,
            name: s.song_name,
            title: s.song_name,
            artist: s.artist_name,
            album: "Single",
            explanation,
            closeness: s.closeness,
            intensity: mappedIntensity,
            saveRatePercent: savePercent,
            saveRate: savePercent,
            sourceTrack: sourceName,
          });
        }
      } else {
        builtNudgeCards = await Promise.all(
          suggestions.map(async (s: any, idx: number) => {
            // lookup source track details
            const matchedSource = currentPlaylist.tracks.find(
              (t) => t.name.toLowerCase().trim() === s.sourceTrack.toLowerCase().trim()
            );
            const sourceName = matchedSource ? matchedSource.name : s.sourceTrack;
            const sourceArtist = matchedSource ? matchedSource.artist : "Unknown";

            const explanation = await generateExplanation(
              processedProfile,
              s.song_name,
              s.artist_name,
              sourceName,
              sourceArtist
            );

            const savePercent = simulateSaveRate(s.closeness);

            const mappedIntensity =
              s.closeness === "safe_step"
                ? "Safe Step"
                : s.closeness === "stretch"
                ? "Stretch"
                : "Leap";

            return {
              id: `nudge-${idx}-${Date.now()}`,
              name: s.song_name,
              title: s.song_name,
              artist: s.artist_name,
              album: "Single",
              explanation,
              closeness: s.closeness,
              intensity: mappedIntensity,
              saveRatePercent: savePercent,
              saveRate: savePercent,
              sourceTrack: sourceName,
            };
          })
        );
      }

      // d. build excludeSongs list
      const excludeSongs = builtNudgeCards.map((n) => ({
        song_name: n.name,
        artist_name: n.artist,
      }));

      // e. buildTasteCircleTracks
      const rawTracks = await buildTasteCircleTracks(
        processedProfile,
        currentPlaylist.tracks,
        excludeSongs
      );

      // f. dedupe
      const filtered = dedupeAgainstList(rawTracks, excludeSongs);

      // g. map into tasteCircleTracks
      const builtCircleTracks: CircleTrack[] = filtered.map((t: any, idx: number) => {
        const matchPercent = t.matchPercent || 85;
        const explanation = t.explanation || "Matches your taste profile";
        const albumName = t.album_name || t.album || "Single";
        return {
          id: `taste-circle-track-${idx}-${Date.now()}`,
          title: t.song_name,
          name: t.song_name,
          artist: t.artist_name,
          album: albumName,
          match: `${matchPercent}%`,
          matchPercent,
          matchReason: explanation,
          saveRate: simulateSaveRate("stretch"),
        };
      });

      // Construct tasteCircle object
      const circleArtists = (processedProfile.coreArtists || []).map((artist) => {
        const initials = artist.split(" ").map((n) => n[0]).join("").substring(0, 2);
        let h = 0;
        for (let i = 0; i < artist.length; i++) h = (h * 31 + artist.charCodeAt(i)) & 0xffffff;
        const colorStart = `hsl(${h % 360}, 50%, 40%)`;
        const colorEnd = `hsl(${(h + 60) % 360}, 50%, 25%)`;
        return { name: artist, initials, gradientFrom: colorStart, gradientTo: colorEnd };
      });

      const processedCircle: TasteCircle = {
        name: processedProfile.circle_name || "🌙 Late Night Indie Explorers",
        listeners: "18,243",
        artists: circleArtists,
        trending: builtCircleTracks.slice(0, 4).map((t) => ({
          title: t.title,
          artist: t.artist,
          saveRate: t.saveRate || 75,
        })),
        tracks: builtCircleTracks,
      };

      setTasteProfile(processedProfile);
      setNudgeCards(builtNudgeCards);
      setTasteCircle(processedCircle);
    } catch (err) {
      console.error("AI pipeline failed:", err);
      setAiError("Using fallback recommendations");

      // Load fallbacks
      const fallbackProfile: TasteProfile = {
        ...FALLBACK_TASTE_PROFILE,
        tags: FALLBACK_TASTE_PROFILE.taste_tags,
        coreArtists: FALLBACK_TASTE_PROFILE.core_artists,
      };

      const fallbackNudgeCards: NudgeCard[] = FALLBACK_NUDGE_CARDS.map((n: any) => ({
        ...n,
        intensity: n.intensity as any,
      }));

      const fallbackCircleTracks: CircleTrack[] = FALLBACK_TASTE_CIRCLE_TRACKS.map((t: any) => ({
        ...t,
      }));

      const fallbackCircleArtists = (fallbackProfile.coreArtists || []).map((artist) => {
        const initials = artist.split(" ").map((n) => n[0]).join("").substring(0, 2);
        let h = 0;
        for (let i = 0; i < artist.length; i++) h = (h * 31 + artist.charCodeAt(i)) & 0xffffff;
        const colorStart = `hsl(${h % 360}, 50%, 40%)`;
        const colorEnd = `hsl(${(h + 60) % 360}, 50%, 25%)`;
        return { name: artist, initials, gradientFrom: colorStart, gradientTo: colorEnd };
      });

      const processedCircle: TasteCircle = {
        name: fallbackProfile.circle_name || "🌙 Late Night Indie Explorers",
        listeners: "18,243",
        artists: fallbackCircleArtists,
        trending: fallbackCircleTracks.slice(0, 4).map((t) => ({
          title: t.title,
          artist: t.artist,
          saveRate: t.saveRate || 75,
        })),
        tracks: fallbackCircleTracks,
      };

      setTasteProfile(fallbackProfile);
      setNudgeCards(fallbackNudgeCards);
      setTasteCircle(processedCircle);
    } finally {
      setIsLoadingAI(false);
    }
  }, [currentPlaylist]);

  useEffect(() => {
    runAIPipeline();
  }, [runAIPipeline]);

  // ── Saved for later ───────────────────────────────────────────────────────
  const [savedForLater, setSavedForLater] = useState<SampleTrack[]>([]);

  // ── Toast State ──────────────────────────────────────────────────────────
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<any>(null);

  const showToast = useCallback((message: string) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(message);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2000);
  }, []);

  const addToSavedForLater = (t: SampleTrack) =>
    setSavedForLater((prev) => (prev.some((x) => x.id === t.id) ? prev : [...prev, t]));

  const removeFromSavedForLater = (id: string) =>
    setSavedForLater((prev) => prev.filter((t) => t.id !== id));

  /** Append a discovered track to the playlist + queue (deduped by name+artist) */
  const appendToPlaylist = useCallback((t: SampleTrack) => {
    setCurrentPlaylist((prev) => {
      const isDupe = prev.tracks.some(
        (x) => x.name.toLowerCase() === t.name.toLowerCase() && x.artist.toLowerCase() === t.artist.toLowerCase()
      );
      if (isDupe) return prev;
      return { ...prev, tracks: [...prev.tracks, t] };
    });
    setCurrentQueue((prev) => {
      const isDupe = prev.some(
        (x) => x.name.toLowerCase() === t.name.toLowerCase() && x.artist.toLowerCase() === t.artist.toLowerCase()
      );
      if (isDupe) return prev;
      return [...prev, t];
    });
  }, []);

  // ── Internal helper: evaluate triggers after count increments ─────────────
  const applyTriggers = useCallback((newCount: number, trackIdx: number) => {
    // Requirement 3: every 4 songs → shouldShowNudge = true
    if (newCount > 0 && newCount % 4 === 0) {
      setShouldShowNudge(true);
    }
  }, []);

  // ── Playback actions ──────────────────────────────────────────────────────

  /**
   * Requirement 2 & 4: advance to next track.
   * If on the last track → end-of-playlist instead of advancing.
   */
  const playNext = useCallback(() => {
    const currentIdx = queue.findIndex((t) => t.id === currentTrack.id);

    // Requirement 4: last track → modal, no advance
    if (currentIdx === lastIndex) {
      setShouldShowEndOfPlaylist(true);
      return;
    }

    const nextTrack = queue[currentIdx + 1];
    const newCount = songsPlayedCount + 1;

    setCurrentTrack(nextTrack);
    setIsPlaying(true);
    setSongsPlayedCount(newCount);
    applyTriggers(newCount, currentIdx + 1);
  }, [currentTrack, queue, lastIndex, songsPlayedCount, applyTriggers]);

  /**
   * Go back to the previous track. No-op at index 0.
   */
  const playPrev = useCallback(() => {
    const currentIdx = queue.findIndex((t) => t.id === currentTrack.id);
    if (currentIdx <= 0) return;
    setCurrentTrack(queue[currentIdx - 1]);
    setIsPlaying(true);
  }, [currentTrack, queue]);

  /**
   * Requirement 6: toggle isPlaying, swap icon.
   */
  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  /**
   * Play a specific track (e.g. clicking a row in PlaylistView).
   * Increments songsPlayedCount and evaluates triggers.
   */
  const playTrack = useCallback((track: SampleTrack) => {
    const trackIdx = queue.findIndex((t) => t.id === track.id);
    const newCount = songsPlayedCount + 1;

    setCurrentTrack(track);
    setIsPlaying(true);
    setSongsPlayedCount(newCount);
    applyTriggers(newCount, trackIdx);
  }, [queue, songsPlayedCount, applyTriggers]);

  /**
   * Play artist fallback track when chip in RepeatBehaviorBanner is clicked
   */
  const playArtistFallback = useCallback((artist: string) => {
    const fallbackTracks: Record<string, SampleTrack> = {
      "The Strokes": {
        id: "fallback-strokes",
        name: "Last Nite",
        artist: "The Strokes",
        album: "Is This It",
        dateAdded: "Jul 2, 2026",
        duration: "3:13",
      },
      "Vampire Weekend": {
        id: "fallback-vw",
        name: "A-Punk",
        artist: "Vampire Weekend",
        album: "Vampire Weekend",
        dateAdded: "Jul 2, 2026",
        duration: "2:17",
      },
    };

    const track = fallbackTracks[artist] || {
      id: "fallback-generic",
      name: "Reptilia",
      artist: artist,
      album: "Room on Fire",
      dateAdded: "Jul 2, 2026",
      duration: "3:39",
    };

    playTrack(track);
    setShouldShowRepeatBanner(false);
  }, [playTrack]);

  // ── Context value ──────────────────────────────────────────────────────────
  const value: AppState = {
    currentPlaylist,
    currentQueue,
    currentTrack,
    isPlaying,
    songsPlayedCount,
    shouldShowNudge,
    shouldShowEndOfPlaylist,
    shouldShowRepeatBanner,
    repeatData,
    tasteProfile,
    nudgeCards,
    tasteCircle,
    tasteCircleTracks: tasteCircle.tracks,
    isLoadingAI,
    aiError,
    savedForLater,
    toastMessage,
    // Playback actions
    playTrack,
    playNext,
    playPrev,
    togglePlay,
    playArtistFallback,
    showToast,
    // Low-level setters
    setCurrentTrack,
    setIsPlaying,
    setShouldShowEndOfPlaylist,
    setShouldShowRepeatBanner,
    setSongsPlayedCount,
    setShouldShowNudge,
    addToSavedForLater,
    removeFromSavedForLater,
    appendToPlaylist,
    setIsLoadingAI,
    setAiError,
    // Phase 4 AI setters
    setTasteProfile,
    setNudgeCards,
    setTasteCircle,
    regenerateAI: () => runAIPipeline(true),
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

export function useAppState(): AppState {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used inside <AppStateProvider>");
  return ctx;
}

export default AppStateContext;
