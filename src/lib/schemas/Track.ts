import * as S from '@effect/schema/Schema';
import { UrlSchema } from './Url';
import { TrackIdSchema } from './TrackId';

export const TrackSchema = S.struct({
  id: TrackIdSchema,
  title: S.string,
  url: UrlSchema,
  description: S.optional(S.string),
  image: S.optional(S.string),
  type: S.string,
  genre: S.array(S.string),
  tags: S.array(S.string),
});

export const decodeTrack = S.decode(TrackSchema);

export type Track = S.To<typeof TrackSchema>;
