import React, {
  Suspense,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";
import "./App.css";
import SearchBar from "./components/SearchBar/SearchBar";
import { ItunesTrack } from "./interfaces/ItunesSearchResult";
import { useAudioPlayer } from "./shared/AudioPlayer";
import {
  useItunesLookupTracks,
  useItunesSearchArtistTracks,
} from "./shared/ItunesSearchQuery";
const TracksTable = React.lazy(
  () => import("./components/TracksTable/TracksTable")
);
const TrackControls = React.lazy(
  () => import("./components/TrackControls/TrackControls")
);
const TrackDetailsTable = React.lazy(
  () => import("./components/TrackDetailsTable/TrackDetailsTable")
);

function App() {
  const [query, setQuery] = useState<string>("");
  const [selected, setSelected] = useState<ItunesTrack>();
  const [play, setPlay] = useState<ItunesTrack>();
  const deferredQuery = useDeferredValue(query);
  const [loadingTracks, setLoadingTracks] = useState(false);
  const [, setLoadingCollection] = useState(false);
  const tracks = useItunesSearchArtistTracks(deferredQuery, setLoadingTracks);
  const [audioState, dispatch] = useAudioPlayer();
  // Memoizing tells React to only re-render when deferredQuery changes,
  // not when query changes.
  const tracksTable = useMemo(
    () => (
      <TracksTable
        tracks={tracks}
        playing={audioState.playing}
        url={audioState.url}
        setSelected={setSelected}
        setPlay={setPlay}
      />
    ),
    [tracks, audioState.playing, audioState.url]
  );
  const collectionIds = useMemo(
    () => (selected?.collectionId ? [selected?.collectionId] : []),
    [selected?.collectionId]
  ); // Only changes the collection id if selected track changes
  const collectionTracks = useItunesLookupTracks(
    collectionIds,
    setLoadingCollection
  );

  useEffect(() => {
    if (play) {
      dispatch({ type: "load", payload: { url: play?.previewUrl } });
    }
  }, [play, dispatch]);

  useEffect(() => {
    setLoadingTracks(true);
  }, [query]);

  function togglePlay(track: ItunesTrack): void {
    if (track.previewUrl === audioState.url) {
      dispatch({
        type: "control",
        payload: { control: audioState.playing ? "pause" : "play" },
      });
    } else {
      dispatch({
        type: "load",
        payload: { url: track.previewUrl },
      });
    }
  }

  return (
    <div className={`App ${selected ? "App_track_selected" : ""}`}>
      <div className="App_main">
        <SearchBar loading={loadingTracks} setQuery={setQuery} />
        <Suspense fallback="Loading...">
          <div className="App_list">{tracksTable}</div>
        </Suspense>
        <div className="App_controls">
          <Suspense>
            {play && (
              <TrackControls
                track={play}
                togglePlay={togglePlay}
                playing={audioState.playing}
                url={audioState.url}
              />
            )}
          </Suspense>
        </div>
      </div>

      <div className="App_track_details">
        <Suspense>
          {selected && (
            <TrackDetailsTable
              track={selected}
              setSelected={setSelected}
              togglePlay={togglePlay}
              playing={audioState.playing}
              url={audioState.url}
              tracks={collectionTracks}
            />
          )}
        </Suspense>
      </div>
    </div>
  );
}

export default App;
