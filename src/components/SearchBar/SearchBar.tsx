import debounce from "lodash/fp/debounce";
import React, { ChangeEvent, FC, useCallback, useMemo } from "react";
import styles from "./SearchBar.module.css";

interface SearchBarProps {
  loading: boolean;
  setQuery: Function;
}

const SearchBar: FC<SearchBarProps> = ({ loading, setQuery }) => {
  const changeHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value),
    [setQuery]
  );

  const debouncedChangeHandler = useMemo(
    () => debounce(300, changeHandler),
    [changeHandler]
  );

  return (
    <div className={`${styles.wrapper} ${loading ? styles.searching : ""}`}>
      <input
        className={styles.input}
        type="text"
        placeholder="Search Artist"
        onChange={debouncedChangeHandler}
      />
      <span className={styles.icon}>
        <span className={`material-icons ${styles.search}`}> search </span>
        <span className={`material-icons ${styles.sync}`}> sync </span>
      </span>
    </div>
  );
};

export default SearchBar;
