import { atom, useRecoilState } from 'recoil';

export const hasInteractedState = atom<boolean>({
  key: 'hasInteracted',
  default: false,
});

export const useHasInteracted = () => useRecoilState(hasInteractedState);
