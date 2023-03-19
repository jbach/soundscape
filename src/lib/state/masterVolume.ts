import { Volume, VolumeSchema } from 'lib/schemas';
import { atom, useRecoilState } from 'recoil';
import { getSyncEffect } from './helpers/sync';
import player from 'lib/player';

const masterVolumeState = atom<Volume>({
  key: 'masterVolume',
  default: 1.0,
  effects: [
    getSyncEffect('userSettings', VolumeSchema),
    ({ onSet, node, getPromise, trigger }) => {
      if (trigger === 'get') {
        getPromise(node).then((initialValue) => {
          player.setVolume(initialValue);
        });
      }
      onSet((nextVolume, prevVolume, isReset) => {
        player.setVolume(nextVolume);
      });
    },
  ],
});

export const useMasterVolume = () => useRecoilState(masterVolumeState);
