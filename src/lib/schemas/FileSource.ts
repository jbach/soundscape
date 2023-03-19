import * as S from '@effect/schema/Schema';

export const FileSourceSchema = S.struct({
  url: S.string,
  type: S.literal('file'),
});

export type FileSource = S.To<typeof FileSourceSchema>;
