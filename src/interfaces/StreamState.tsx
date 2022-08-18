export interface StreamState {
  url: string | undefined;
  control: string | undefined;
  playing: boolean;
  duration: number | undefined;
  canplay: boolean;
  error: boolean;
}
