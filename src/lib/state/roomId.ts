import * as S from '@effect/schema/Schema';
import { atom, useRecoilState } from 'recoil';
import { getSyncEffect } from './helpers/sync';
import { RoomId, RoomIdSchema } from 'lib/schemas';

export const roomIdState = atom<RoomId | undefined>({
  key: 'roomId',
  default: undefined,
  effects: [getSyncEffect('hash', S.union(RoomIdSchema, S.undefined))],
});

export const useRoomId = () => useRecoilState(roomIdState);
