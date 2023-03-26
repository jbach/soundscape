import * as S from '@effect/schema/Schema';
import { pipe } from '@effect/data/Function';

// volume value between 0 and 1
export const VolumeValueSchema = pipe(S.number, S.between(0, 1));
export type VolumeValue = S.To<typeof VolumeValueSchema>;

// volume state
export const VolumeSchema = S.struct({
  value: VolumeValueSchema,
  muted: S.boolean,
});
export type Volume = S.To<typeof VolumeSchema>;
