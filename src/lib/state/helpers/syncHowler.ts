import { AtomEffect } from 'recoil';
import { Howl } from 'howler';
import { SoundNodeId, SoundState, Url, Volume, VolumeValue } from 'lib/schemas';
import { findTrack } from '../tracks';
import { getComputedVolume } from '../volume';
import { soundFamily } from '../sound';
import { getNodeLeafs } from '../soundNode';

const howlMap = new Map<SoundNodeId, Howl>();

const howlManager = {
  play: (nodeId: SoundNodeId, trackUrl: Url, volume: VolumeValue) => {
    return new Promise<Howl>((resolve, reject) => {
      // instance does not exist, so lets create it
      if (!howlMap.has(nodeId)) {
        const howl = new Howl({
          src: trackUrl,
          html5: true,
          autoplay: true,
          format: ['mp3'],
          loop: true,
          volume,
          onload: () => {
            resolve(howl);
          },
        });
        howlMap.set(nodeId, howl);
      } else {
        // todo: what if has instance and other track is playing?
        // (same node, different track)
        const howl = howlMap.get(nodeId);
        resolve(howl as Howl); // hack to fix missing type narrowing by Map.has
      }
    });
  },
  stop: (nodeId: SoundNodeId) => {
    // stop and unload?
    if (howlMap.has(nodeId)) {
      howlMap.get(nodeId)?.off();
      howlMap.get(nodeId)?.stop();
      howlMap.get(nodeId)?.unload();
      howlMap.delete(nodeId);
      // todo: clear getHowl selector cache?
    }
  },
};

// play/stop via Sound atom
export const syncSoundWithHowlerEffect: (
  nodeId: SoundNodeId
) => AtomEffect<SoundState> =
  (nodeId) =>
  ({ getPromise, onSet, trigger }) => {
    const play = async () => {
      const sound = await getPromise(soundFamily(nodeId));

      if (!sound) {
        throw new Error(`Sound (nodeId: ${nodeId}) not found`);
      }

      const track = await getPromise(findTrack(sound.trackId));

      if (!track) {
        throw new Error(`Track (trackId: ${sound.trackId}) not found`);
      }

      // play
      const computedVolume = await getPromise(getComputedVolume(sound.id));
      howlManager.stop(nodeId);
      howlManager.play(nodeId, track.url, computedVolume);
    };

    if (trigger === 'get') {
      play();
    }

    onSet(async (nextValue, prevValue, isReset) => {
      howlManager.stop(nodeId);

      if (!isReset && nextValue) {
        await play();
      }
    });

    return () => {
      console.log('cleanup');
    };
  };

// if any volume changes, recompute all child leaf nodes volume
export const syncVolumeWithHowlerEffect: (
  nodeId: SoundNodeId
) => AtomEffect<Volume> =
  (nodeId) =>
  ({ node, onSet, getPromise, trigger }) => {
    const computeLeafNodes = async () => {
      const leafs = await getPromise(getNodeLeafs(nodeId));
      const sounds = leafs.filter((leaf) => leaf.type === 'sound');

      sounds.forEach(async (sound) => {
        const computedVolume = await getPromise(getComputedVolume(sound.id));
        if (howlMap.has(sound.id)) {
          howlMap.get(sound.id)?.volume(computedVolume);
        }
      });
    };

    if (trigger === 'get') {
      computeLeafNodes();
    }

    onSet(computeLeafNodes);
  };
