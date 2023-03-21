import { Volume, VolumeSchema } from 'lib/schemas';
import { atom, useRecoilState } from 'recoil';
import { getSyncEffect } from './helpers/sync';
import { perceptualToAmplitude } from '@discordapp/perceptual';
import { Howler } from 'howler';

const setGlobalVolume = (volume: Volume) =>
  Howler.volume(perceptualToAmplitude(volume));

// -- atom
const masterVolumeState = atom<Volume>({
  key: 'masterVolume',
  default: 1.0,
  effects: [
    getSyncEffect('userSettings', VolumeSchema),
    // sync master volume
    ({ onSet, node, getPromise, trigger }) => {
      if (trigger === 'get') {
        getPromise(node).then((initialValue) => {
          setGlobalVolume(initialValue);
        });
      }
      onSet((nextVolume, prevVolume, isReset) => {
        setGlobalVolume(nextVolume);
      });
    },
  ],
});

// -- public api
export const useMasterVolume = () => useRecoilState(masterVolumeState);
