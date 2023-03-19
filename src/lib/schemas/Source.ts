import * as S from '@effect/schema/Schema';
import { FileSourceSchema } from './FileSource';

export const SourceSchema = S.union(FileSourceSchema);
export type Source = S.To<typeof SourceSchema>;
