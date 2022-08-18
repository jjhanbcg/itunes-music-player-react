import fetchJsonp from "fetch-jsonp";
import { useEffect, useMemo, useState } from "react";
import {
  ItunesArtist,
  ItunesArtistTracksResponse,
  ItunesTrack,
} from "../interfaces/ItunesSearchResult";

export const ITUNES_SEARCH_API_ENDPOINT = "https://itunes.apple.com";
export const ITUNES_SEARCH_API_TIMEOUT = 10000;

// TODO::Investigate how to abort a fetch jsonp using abort controller signal

export function useItunesSearchArtistTracks(
  term: string,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
): ItunesTrack[] {
  const artists = useItunesSearchArtists(term);
  // https://github.com/facebook/react/issues/14476#issuecomment-471199055
  const artistIds = useMemo(
    () => artists.map((artist) => artist.artistId),
    [artists]
  ); // Only changes the artist ids if artists changes
  const tracks = useItunesLookupTracks(artistIds, setLoading);
  return tracks;
}

export function useItunesSearchArtists(term: string): ItunesArtist[] {
  const [artists, setArtists] = useState<ItunesArtist[]>([]);
  term = term.trim();

  useEffect(() => {
    if (!term) {
      return setArtists([]);
    }

    fetchJsonp(
      getItunesSearchQuery("/search", {
        term,
        entity: "allArtist",
        limit: "50",
      }),
      { timeout: ITUNES_SEARCH_API_TIMEOUT }
    )
      .then((response) => response.json())
      .then(
        (json) => {
          setArtists(json?.results);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.error(error);
        }
      );
  }, [term]);

  return artists;
}

export function useItunesLookupTracks(
  ids: number[],
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
): ItunesTrack[] {
  const [tracks, setTracks] = useState<ItunesTrack[]>([]);

  useEffect(() => {
    if (!ids.length) {
      setLoading(false);
      return setTracks([]);
    }

    fetchJsonp(getItunesTracksQuery(ids), {
      timeout: ITUNES_SEARCH_API_TIMEOUT,
    })
      .then((response) => response.json())
      .then(
        (json: ItunesArtistTracksResponse) => {
          setTracks(
            json?.results.filter(
              (item) => item.wrapperType === "track"
            ) as ItunesTrack[]
          );
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.error(error);
        }
      )
      .finally(() => setLoading(false));
  }, [ids, setLoading]);

  return tracks;
}

export function getItunesTracksQuery(ids: number[], limit = 5): string {
  // Limit results for optimising performance, at least one track from each artist
  limit = ids.length > 0 ? Math.ceil(50 / ids.length) : 5;
  return getItunesSearchQuery("/lookup", {
    id: ids.join(","),
    media: "music",
    entity: "song",
    limit: limit.toString(),
  });
}

export function getItunesSearchQuery(
  path?: string,
  params?:
    | string
    | string[][]
    | Record<string, string>
    | URLSearchParams
    | undefined
): string {
  const queryParams = getItunesSearchQueryStr(params);
  return (
    ITUNES_SEARCH_API_ENDPOINT +
    (path || "") +
    (queryParams ? "?" + queryParams : "")
  );
}

export function getItunesSearchQueryStr(
  params?:
    | string
    | string[][]
    | Record<string, string>
    | URLSearchParams
    | undefined
): string {
  // https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
  return new URLSearchParams(params).toString().replace(/%2C/g, ",");
}
