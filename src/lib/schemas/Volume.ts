import * as S from '@effect/schema/Schema';
import { pipe } from '@effect/data/Function';

export const VolumeSchema = pipe(S.number, S.between(0, 1));
export type Volume = S.To<typeof VolumeSchema>;
