import {
  DefaultValue,
  selector,
  selectorFamily,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import { SoundNodeId, Track, TrackId, decodeTrack } from 'lib/schemas';
import defaultTracks from 'lib/defaultTracks';
import { getNodeSounds, soundNodeFamily } from './soundNode';
import {
  LOCAL_SOUNDSCAPE_NODE_ID,
  SHARED_SOUNDSCAPE_NODE_ID,
} from 'lib/constants';
import { soundFamily } from './sound';
import humanId from 'human-id';
import { useCallback } from 'react';
import { volumeFamily } from './volume';

const cleanTags = (tags: ReadonlyArray<string>) => {
  // clean & deduplicate
  return [
    ...new Set(
      tags.reduce((arr, tag) => {
        return [...arr, ...tag.split(', ')];
      }, [] as string[])
    ),
  ];
};

type TracksMap = Record<string, Track>;

// -- root selector (we can switch to atom if the need arises)
export const tracksState = selector({
  key: 'tracks',
  get: () => {
    return defaultTracks.map((track) => decodeTrack(track));
  },
});

// -- selectors

/**
 * returns all tracks
 */
export const tracksListState = selector<Track[]>({
  key: 'tracksList',
  get: ({ get }) => {
    const tracks = get(tracksState);
    return tracks.map((track) => ({
      ...track,
      tags: cleanTags(track.tags),
      genre: cleanTags(track.genre),
    }));
  },
});

/**
 * returns all tracks as map keyed by TrackId
 */
export const tracksMapState = selector<TracksMap>({
  key: 'tracksMap',
  get: ({ get }) => {
    const tracks = get(tracksListState);

    return tracks.reduce(
      (obj, track) => ({
        ...obj,
        [track.id]: decodeTrack(track),
      }),
      {} as TracksMap
    );
  },
});

/**
 * given a TrackId, this selector will return the corresponding full Track
 */
export const findTrack = selectorFamily({
  key: 'findTrack',
  get:
    (trackId: TrackId | undefined) =>
    ({ get }) => {
      if (trackId) {
        const tracksMap = get(tracksMapState);

        if (trackId in tracksMap) {
          return tracksMap[trackId];
        }

        throw new Error(`trackId "${trackId}"" not found`);
      }

      return undefined;
    },
});

/**
 * given a SoundNodeId, this selector will return the first running sound
 */
export const getSingleTrack = selectorFamily({
  key: 'singleTrack',
  get:
    (nodeId: SoundNodeId) =>
    ({ get }) => {
      const sounds = get(getNodeSounds(nodeId));

      if (sounds.length > 0) {
        const track = get(findTrack(sounds[0].trackId));
        return track;
      }
    },
  set:
    (nodeId: SoundNodeId) =>
    ({ get, set, reset }, newValue) => {
      const sounds = get(getNodeSounds(nodeId));

      // is reset -> stop current track
      if (newValue instanceof DefaultValue || !newValue) {
        if (sounds.length > 0) {
          // stop currently playing sound
          set(soundNodeFamily(nodeId), (localNode) =>
            localNode
              ? {
                  ...localNode,
                  children: localNode.children.slice(1),
                }
              : null
          );
          reset(soundNodeFamily(sounds[0].id));
          reset(soundFamily(sounds[0].id));
        }

        return;
      }

      // same track
      if (
        sounds.some(
          (sound) => sound.id === newValue.id && sound.trackId === newValue.id
        )
      ) {
        return;
      }

      if (sounds.length > 0) {
        // replace existing sound
        set(soundFamily(sounds[0].id), {
          id: sounds[0].id,
          trackId: newValue.id,
        });
      } else {
        // play fresh sound
        const soundNodeId = humanId();

        // sound itself
        set(soundFamily(soundNodeId), {
          id: soundNodeId,
          trackId: newValue.id,
        });

        // sound node
        set(soundNodeFamily(soundNodeId), {
          id: soundNodeId,
          type: 'sound',
          children: [],
        });

        // add sound node to track
        set(soundNodeFamily(nodeId), (localNode) =>
          localNode
            ? {
                ...localNode,
                children: localNode.children.concat(soundNodeId),
              }
            : {
                id: nodeId,
                type: 'group' as const,
                children: [soundNodeId],
              }
        );
      }
    },
});

// -- public api
export const useTracks = () => useRecoilValue(tracksListState);
export const currentTrackState = getSingleTrack(SHARED_SOUNDSCAPE_NODE_ID);
export const localTrackState = getSingleTrack(LOCAL_SOUNDSCAPE_NODE_ID);

export const useCurrentTrack = (track: Track) => {
  const setSharedVolume = useSetRecoilState(
    volumeFamily(SHARED_SOUNDSCAPE_NODE_ID)
  );

  const [currentTrack, setCurrentTrack] = useRecoilState(currentTrackState);
  const setLocalTrack = useSetRecoilState(localTrackState);

  const isPlaying = currentTrack?.id === track.id;

  const toggleCurrentTrack = useCallback(() => {
    setSharedVolume((prev) => ({ ...prev, muted: false }));
    setLocalTrack(undefined);
    setCurrentTrack(isPlaying ? undefined : track);
  }, [setLocalTrack, setCurrentTrack, track, setSharedVolume, isPlaying]);

  return [toggleCurrentTrack, isPlaying] as const;
};

export const usePreview = (track: Track) => {
  const setSharedVolume = useSetRecoilState(
    volumeFamily(SHARED_SOUNDSCAPE_NODE_ID)
  );

  const [localTrack, setLocalTrack] = useRecoilState(localTrackState);

  const isPlaying = localTrack?.id === track.id;

  const togglePreview = useCallback(() => {
    setSharedVolume((prev) => ({ ...prev, muted: !isPlaying }));
    setLocalTrack(isPlaying ? undefined : track);
  }, [setLocalTrack, track, setSharedVolume, isPlaying]);

  return [togglePreview, isPlaying] as const;
};
