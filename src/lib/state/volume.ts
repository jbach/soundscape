import { atomFamily, selectorFamily } from 'recoil';
import { SoundNodeId, VolumeSchema, Volume, VolumeValue } from 'lib/schemas';
import { getSyncEffect } from './helpers/sync';
import {
  LOCAL_SOUNDSCAPE_NODE_ID,
  ROOT_NODE_ID,
  SHARED_SOUNDSCAPE_NODE_ID,
} from 'lib/constants';
import getLogEffect from './helpers/logEffect';
import { syncVolumeWithHowlerEffect } from './helpers/syncHowler';
import { getPath } from './soundNode';

const syncSharedEffect = getSyncEffect('shared', VolumeSchema);
const syncUserSettingsEffect = getSyncEffect('userSettings', VolumeSchema);

// -- atom
export const volumeFamily = atomFamily<Volume, SoundNodeId>({
  key: 'VolumeState',
  default: {
    value: 1.0,
    muted: false,
  },
  effects: (nodeId) => {
    // root node state should be synced with local storage
    if (nodeId === ROOT_NODE_ID) {
      return [
        syncUserSettingsEffect,
        getLogEffect(nodeId, 'Volume'),
        syncVolumeWithHowlerEffect(nodeId),
      ];
    }

    // soundscape nodes should not be shared
    if (
      nodeId === LOCAL_SOUNDSCAPE_NODE_ID ||
      nodeId === SHARED_SOUNDSCAPE_NODE_ID
    ) {
      return [
        getLogEffect(nodeId, 'Volume'),
        syncVolumeWithHowlerEffect(nodeId),
      ];
    }

    return [
      syncSharedEffect,
      getLogEffect(nodeId, 'Volume'),
      syncVolumeWithHowlerEffect(nodeId),
    ];
  },
});

export const getComputedVolume = selectorFamily<VolumeValue, SoundNodeId>({
  key: 'Volume/computedVolume',
  get:
    (nodeId) =>
    ({ get, getCallback }) => {
      const path = get(getPath(nodeId));
      return path.reduce((computedVolume: VolumeValue, ancestorId) => {
        const volume = get(volumeFamily(ancestorId));

        if (volume.muted) {
          return 0;
        }

        return volume.value * computedVolume;
      }, 1);
    },
});
