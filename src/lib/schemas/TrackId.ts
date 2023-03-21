import * as S from '@effect/schema/Schema';

export const TrackIdSchema = S.string;

export type TrackId = S.To<typeof TrackIdSchema>;
