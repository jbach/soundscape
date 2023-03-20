import {
  AtomEffect,
  atom,
  selector,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import * as S from '@effect/schema/Schema';
import { getSyncEffect } from './helpers/sync';
import player from 'lib/player';
import { getTrack } from 'lib/tracks';
import { trackIdSchema } from 'lib/schemas';
import defaultFavicon from 'img/favicon.svg';
import playingFavicon from 'img/playing.svg';

const currentTrackIdSchema = S.union(trackIdSchema, S.undefined);
type CurrentTrackId = S.To<typeof currentTrackIdSchema>;

/**
 * syncs playstate with favicon
 */
const syncFaviconEffect: AtomEffect<CurrentTrackId> = ({
  onSet,
  node,
  getPromise,
  trigger,
}) => {
  if (trigger === 'get') {
    // delete existing favicons
    const existingElements =
      document.querySelectorAll<HTMLLinkElement>('link[rel*="icon"]');
    existingElements.forEach((element) => document.head.removeChild(element));

    // create favicon
    const element = document.createElement('link');
    element.rel = 'shortcut icon';
    document.querySelector('head')?.appendChild(element);
    element.setAttribute('type', 'image/svg+xml');
    element.setAttribute('href', defaultFavicon);

    getPromise(node).then((initialTrack) => {
      if (initialTrack) {
        element.setAttribute('href', playingFavicon);
      }
    });

    onSet((nextTrack, prevTrack, isReset) => {
      if (isReset || !nextTrack) {
        // stop
        element.setAttribute('href', defaultFavicon);
      } else if (nextTrack !== prevTrack) {
        // play
        element.setAttribute('href', playingFavicon);
      }
    });
  }
};

const currentTrackIdState = atom<CurrentTrackId>({
  key: 'currentTrackId',
  default: undefined,
  effects: [
    getSyncEffect('shared', currentTrackIdSchema),
    // sync with player
    ({ onSet, node, getPromise, trigger }) => {
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
    syncFaviconEffect,
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
