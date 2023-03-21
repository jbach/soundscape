import * as S from '@effect/schema/Schema';
import { UrlSchema } from './Url';

export const FileSourceSchema = S.struct({
  url: UrlSchema,
  type: S.literal('file'),
});

export type FileSource = S.To<typeof FileSourceSchema>;
