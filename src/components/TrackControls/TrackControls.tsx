import React, { FC } from "react";
import { ItunesTrack } from "../../interfaces/ItunesSearchResult";
import styles from "./TrackControls.module.css";

interface TrackControlsProps {
  track: ItunesTrack;
  playing: boolean;
  url: string | undefined;
  togglePlay: (track: ItunesTrack) => void | undefined;
}

const TrackControls: FC<TrackControlsProps> = ({
  track,
  togglePlay,
  playing,
  url,
}) => (
  <div className={styles.controls}>
    <button
      type="button"
      className={`${styles.circle} ${
        (!playing || track.previewUrl !== url) && styles.paused
      }`}
      onClick={() => {
        togglePlay(track);
      }}
    >
      <span className={styles["circle_btn"]}>
        <span className={`material-icons ${styles.play}`}> play_arrow </span>
        <span className={`material-icons ${styles.pause}`}> pause </span>
      </span>
      <span className={styles["circle_back-1"]}></span>
      <span className={styles["circle_back-2"]}></span>
    </button>
  </div>
);

export default TrackControls;
