import * as S from '@effect/schema/Schema';
import { TrackIdSchema } from 'lib/schemas';
import { SoundNodeIdSchema } from './SoundNode';

export const SoundSchema = S.struct({
  id: SoundNodeIdSchema,
  trackId: TrackIdSchema,
});
export type Sound = S.To<typeof SoundSchema>;

export const SoundStateSchema = S.union(SoundSchema, S.null);
export type SoundState = S.To<typeof SoundStateSchema>;
