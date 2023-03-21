import * as S from '@effect/schema/Schema';
import { atom, useRecoilState } from 'recoil';
import { getSyncEffect } from './helpers/sync';
import { RoomIdSchema } from 'lib/schemas';

// -- schema
const CurrentRoomIdSchema = S.union(RoomIdSchema, S.undefined);
type CurrentRoomId = S.To<typeof CurrentRoomIdSchema>;

// -- effects
const syncHashEffect = getSyncEffect('hash', CurrentRoomIdSchema);

// -- atom
export const roomIdState = atom<CurrentRoomId>({
  key: 'roomId',
  default: undefined,
  effects: [syncHashEffect],
});

// -- public api
export const useRoomId = () => useRecoilState(roomIdState);
