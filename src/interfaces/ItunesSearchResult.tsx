export interface ItunesResponse {
  resultCount: number;
}

export interface ItunesArtist {
  wrapperType: "artist";
  artistType: string;
  artistName: string;
  artistLinkUrl: string;
  artistId: number;
  amgArtistId: number;
  primaryGenreName: string;
  primaryGenreId: number;
}

export interface ItunesTrack {
  wrapperType: "track";
  kind: string;
  artistId: number;
  collectionId: number;
  trackId: number;
  artistName: string;
  collectionName: string;
  trackName: string;
  collectionCensoredName: string;
  trackCensoredName: string;
  artistViewUrl: string;
  collectionViewUrl: string;
  trackViewUrl: string;
  previewUrl: string;
  artworkUrl30: string;
  artworkUrl60: string;
  artworkUrl100: string;
  collectionArtistName?: string | undefined;
  collectionPrice?: number | undefined;
  trackPrice?: number | undefined;
  releaseDate: string;
  collectionExplicitness: string;
  trackExplicitness: string;
  discCount: number;
  discNumber: number;
  trackCount: number;
  trackNumber: number;
  trackTimeMillis: number;
  country: string;
  currency: string;
  primaryGenreName: string;
  isStreamable: boolean;
  contentAdvisoryRating?: string | undefined;
}

export interface ItunesCollection {
  wrapperType: "collection";
  collectionType: string;
  artistId: number;
  collectionId: number;
  amgArtistId: number;
  artistName: string;
  collectionName: string;
  collectionCensoredName: string;
  artistViewUrl: string;
  collectionViewUrl: string;
  artworkUrl60: string;
  artworkUrl100: string;
  collectionPrice: number;
  collectionExplicitness: string;
  trackCount: number;
  copyright: string;
  country: string;
  currency: string;
  releaseDate: Date;
  primaryGenreName: string;
}

export interface ItunesArtistResponse extends ItunesResponse {
  results: ItunesArtist[];
}

export interface ItunesArtistTracksResponse extends ItunesResponse {
  results: (ItunesArtist | ItunesTrack)[];
}

export interface ItunesCollectionTracksResponse extends ItunesResponse {
  results: (ItunesCollection | ItunesTrack)[];
}
