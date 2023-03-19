import * as S from '@effect/schema/Schema';

export const RoomIdSchema = S.string;
export type RoomId = S.To<typeof RoomIdSchema>;
