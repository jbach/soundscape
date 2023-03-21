import * as S from '@effect/schema/Schema';
import { pipe } from '@effect/data/Function';

export const UrlSchema = pipe(S.string, S.brand('Url'));

export type Url = S.To<typeof UrlSchema>;
