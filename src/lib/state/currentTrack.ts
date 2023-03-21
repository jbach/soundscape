import {
  AtomEffect,
  DefaultValue,
  atom,
  selector,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import * as S from '@effect/schema/Schema';
import { getSyncEffect } from './helpers/sync';
import defaultFavicon from 'img/favicon.svg';
import playingFavicon from 'img/playing.svg';
import { findTrackState } from './tracks';
import { TrackIdSchema } from 'lib/schemas';
import { Howl, Howler } from 'howler';

// -- schema
const currentTrackIdSchema = S.union(TrackIdSchema, S.undefined);
type CurrentTrackId = S.To<typeof currentTrackIdSchema>;

// -- effects

/**
 * syncs playstate with favicon
 * @todo move to sounds
 */
const syncFaviconEffect: AtomEffect<CurrentTrackId> = ({
  onSet,
  node,
  getPromise,
  trigger,
}) => {
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

  // set initial value
  if (trigger === 'get') {
    getPromise(node).then((initialTrack) => {
      if (initialTrack) {
        element.setAttribute('href', playingFavicon);
      }
    });
  }

  // on update of currentTrackid, change favicon
  onSet((nextTrack, prevTrack, isReset) => {
    if (isReset || !nextTrack) {
      // stop
      element.setAttribute('href', defaultFavicon);
    } else if (nextTrack !== prevTrack) {
      // play
      element.setAttribute('href', playingFavicon);
    }
  });
};

const syncPlayerEffect: AtomEffect<CurrentTrackId> = ({
  onSet,
  node,
  getPromise,
  trigger,
}) => {
  const play = (trackId: CurrentTrackId) =>
    getPromise(findTrackState(trackId)).then((track) => {
      if (track) {
        Howler.unload();

        new Howl({
          src: track.url,
          html5: true,
          autoplay: true,
          format: ['mp3'],
          loop: true,
        });
      }
    });

  if (trigger === 'get') {
    getPromise(node).then(play);
  }

  onSet((nextTrackId, prevTrackId, isReset) => {
    if (isReset || !nextTrackId) {
      // track was stopped
      Howler.unload();
    } else if (nextTrackId !== prevTrackId) {
      // track changed
      play(nextTrackId);
    }
  });
};

const syncSharedEffect = getSyncEffect('shared', currentTrackIdSchema);

// -- atom
const currentTrackIdState = atom<CurrentTrackId>({
  key: 'currentTrackId',
  default: undefined,
  effects: [syncSharedEffect, syncPlayerEffect, syncFaviconEffect],
});

// -- selectors
const currentTrackState = selector({
  key: 'currentTrack',
  get: ({ get }) => {
    const trackId = get(currentTrackIdState);
    return get(findTrackState(trackId));
  },
  set: ({ get, set }, nextValue) => {
    // if currentTrack is changed, update currentTrackId
    set(
      currentTrackIdState,
      nextValue instanceof DefaultValue ? nextValue : nextValue?.id
    );
  },
});

// -- public api
export const useCurrentTrack = () => {
  const currentTrack = useRecoilValue(currentTrackState);
  const setCurrentTrackId = useSetRecoilState(currentTrackIdState);

  return [currentTrack, setCurrentTrackId] as const;
};
