import { useDebouncedCallback } from '@react-hookz/web';
import { useCallback, useState } from 'react';

const useDebouncedInput = (
  setDebounced: (nextValue: string) => void,
  initialValue = '',
  debounceDelay = 300
) => {
  // store input value
  const [input, _setInput] = useState(initialValue);

  // debounce setter
  const debouncedSetInput = useDebouncedCallback(
    setDebounced,
    [setDebounced],
    debounceDelay
  );

  // set input and debounced value
  const setInput = useCallback(
    (nextValue: string = '') => {
      _setInput(nextValue);
      debouncedSetInput(nextValue);
    },
    [_setInput, debouncedSetInput]
  );

  return [input, setInput] as const;
};

export default useDebouncedInput;
