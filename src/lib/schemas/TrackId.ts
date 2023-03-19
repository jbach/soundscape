import { rawTracks } from 'lib/tracks';
import * as S from '@effect/schema/Schema';

export const trackIdSchema = S.literal(...rawTracks.map((t) => t.key));
export type TrackId = S.To<typeof trackIdSchema>;
