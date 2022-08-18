import React, { FC } from "react";
import { ItunesTrack } from "../../interfaces/ItunesSearchResult";
import TrackControls from "../TrackControls/TrackControls";
import TrackRow from "../TrackRow/TrackRow";
import styles from "./TrackDetailsTable.module.css";

interface TrackDetailsTableProps {
  track: ItunesTrack;
  togglePlay: (track: ItunesTrack) => void | undefined;
  playing: boolean;
  url: string | undefined;
  tracks: ItunesTrack[];
  setSelected: (track: ItunesTrack) => void | undefined;
}

const TrackDetailsTable: FC<TrackDetailsTableProps> = ({
  track,
  tracks,
  togglePlay,
  playing,
  url,
  setSelected,
}) => (
  <div className={styles.collection}>
    <img
      className={styles.cover}
      src={track.artworkUrl100}
      alt={track.trackName}
    />

    <div className={styles.controls}>
      <TrackControls
        track={track}
        togglePlay={togglePlay}
        playing={playing}
        url={url}
      />
    </div>

    <ul className={styles.list}>
      {tracks.map((track) => (
        <TrackRow
          key={track.trackId}
          track={track}
          selectTrack={setSelected}
          playing={playing}
          url={url}
        />
      ))}
    </ul>
  </div>
);

export default TrackDetailsTable;
