import { TrackId } from 'lib/schemas';
import allTracks from './allTracks';

export const getTrack = (trackId: TrackId) => {
  return allTracks.find((track) => track.key === trackId);
};
