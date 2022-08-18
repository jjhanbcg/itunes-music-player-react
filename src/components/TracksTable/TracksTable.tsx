import React, { FC } from "react";
import { ItunesTrack } from "../../interfaces/ItunesSearchResult";
import TrackRow from "../TrackRow/TrackRow";
import styles from "./TracksTable.module.css";

interface TracksTableProps {
  tracks: ItunesTrack[];
  playing: boolean;
  url: string | undefined;
  setSelected: React.Dispatch<React.SetStateAction<ItunesTrack | undefined>>;
  setPlay: React.Dispatch<React.SetStateAction<ItunesTrack | undefined>>;
}

const TracksTable: FC<TracksTableProps> = ({
  tracks,
  playing,
  url,
  setSelected,
  setPlay,
}) => {
  function selectTrack(track: ItunesTrack): void {
    setSelected(track);
    if (window.innerWidth <= 768) {
      setPlay(track);
    }
  }

  return (
    <ul className={styles.list}>
      {tracks.map((track) => (
        <TrackRow
          key={track.trackId}
          track={track}
          playing={playing}
          url={url}
          selectTrack={selectTrack}
        />
      ))}
    </ul>
  );
};

export default TracksTable;
