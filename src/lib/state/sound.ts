import { atomFamily } from 'recoil';
import { SoundNodeId, SoundState, SoundStateSchema } from 'lib/schemas';
import { getSyncEffect } from './helpers/sync';
import {
  LOCAL_SOUNDSCAPE_NODE_ID,
  ROOT_NODE_ID,
  SHARED_SOUNDSCAPE_NODE_ID,
} from 'lib/constants';
import getLogEffect from './helpers/logEffect';
import { syncSoundWithHowlerEffect } from './helpers/syncHowler';

const syncSharedEffect = getSyncEffect('shared', SoundStateSchema);
const syncUserSettingsEffect = getSyncEffect('userSettings', SoundStateSchema);

// -- atom
export const soundFamily = atomFamily<SoundState, SoundNodeId>({
  key: 'SoundState',
  default: null,
  effects: (nodeId) => {
    // root node state should be synced with local storage
    if (nodeId === ROOT_NODE_ID) {
      return [
        syncUserSettingsEffect,
        getLogEffect(nodeId, 'Sound'),
        syncSoundWithHowlerEffect(nodeId),
      ];
    }

    // soundscape tracks should not be shared
    if (
      nodeId === LOCAL_SOUNDSCAPE_NODE_ID ||
      nodeId === SHARED_SOUNDSCAPE_NODE_ID
    ) {
      return [
        getLogEffect(nodeId, 'Volume'),
        syncSoundWithHowlerEffect(nodeId),
      ];
    }

    return [
      syncSharedEffect,
      getLogEffect(nodeId, 'Sound'),
      syncSoundWithHowlerEffect(nodeId),
    ];
  },
});
