import { atom, selector, useRecoilValue, useSetRecoilState } from 'recoil';
import * as S from '@effect/schema/Schema';
import { getSyncEffect } from './helpers/sync';
import player from 'lib/player';
import { getTrack } from 'lib/tracks';
import { trackIdSchema } from 'lib/schemas';

const currentTrackIdSchema = S.union(trackIdSchema, S.undefined);
type CurrentTrackId = S.To<typeof currentTrackIdSchema>;

const currentTrackIdState = atom<CurrentTrackId>({
  key: 'currentTrackId',
  default: undefined,
  effects: [
    getSyncEffect('shared', currentTrackIdSchema),
    ({ onSet, node, getPromise, trigger, getLoadable }) => {
      if (trigger === 'get') {
        getPromise(node).then((initialTrack) => {
          if (initialTrack) {
            player.play(initialTrack);
          }
        });
      }

      onSet((nextTrack, prevTrack, isReset) => {
        if (isReset || !nextTrack) {
          // todo: think of fading out
          player.stop();
          // todo: we could compare to currently playing file (player.track)?
        } else if (nextTrack !== prevTrack) {
          // track changed
          player.play(nextTrack);
        }
      });
    },
  ],
});

const currentTrackState = selector({
  key: 'currentTrack',
  get: ({ get }) => {
    const trackId = get(currentTrackIdState);
    if (trackId) {
      const track = getTrack(trackId);

      if (!track) {
        throw new Error('trackId not found');
      }

      return track;
    }
  },
});

export const useCurrentTrack = () => {
  const currentTrack = useRecoilValue(currentTrackState);
  const setCurrentTrackId = useSetRecoilState(currentTrackIdState);

  return [currentTrack, setCurrentTrackId] as const;
};
