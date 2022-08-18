import React, { FC } from "react";
import { ItunesTrack } from "../../interfaces/ItunesSearchResult";
import styles from "./TrackRow.module.css";

interface TrackRowProps {
  track: ItunesTrack;
  playing: boolean;
  url: string | undefined;
  selectTrack: (track: ItunesTrack) => void | undefined;
}

const TrackRow: FC<TrackRowProps> = ({ track, playing, url, selectTrack }) => (
  <li
    className={styles.item}
    onClick={() => {
      selectTrack && selectTrack(track);
    }}
  >
    <div>
      <img src={track.artworkUrl60} alt={track.trackName} />
    </div>

    <div className={styles["item-content"]}>
      <div>
        <em>{track.trackName}</em>
      </div>
      <div>{track.artistName}</div>
      <div>{track.collectionName}</div>
    </div>

    {playing && track.previewUrl === url && (
      <span className="boxContainer">
        <span className="box box1"></span>
        <span className="box box2"></span>
        <span className="box box3"></span>
        <span className="box box4"></span>
        <span className="box box5"></span>
      </span>
    )}
  </li>
);

export default TrackRow;
