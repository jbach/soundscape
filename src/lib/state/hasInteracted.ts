import { atom, useRecoilState } from 'recoil';

// -- atom
export const hasInteractedState = atom<boolean>({
  key: 'hasInteracted',
  default: false,
});

// -- public api
export const useHasInteracted = () => useRecoilState(hasInteractedState);
