import * as S from '@effect/schema/Schema';
import { atom, useRecoilState } from 'recoil';
import { getSyncEffect } from './helpers/sync';
import { useColorScheme } from '@mantine/hooks';
import { useCallback } from 'react';

const DarkModeSettingSchema = S.literal('light', 'dark', 'system');
type DarkModeSetting = S.To<typeof DarkModeSettingSchema>;

const darkModeSettingState = atom<DarkModeSetting>({
  key: 'darkMode',
  default: 'system',
  effects: [getSyncEffect('userSettings', DarkModeSettingSchema)],
});

export const useDarkModeSetting = () => {
  const preferredColorScheme = useColorScheme('light');
  const [userColorScheme, setUserColorScheme] =
    useRecoilState(darkModeSettingState);
  const toggleColorScheme = useCallback(() => {
    setUserColorScheme((prevUserColorScheme) => {
      if (prevUserColorScheme === 'system') {
        return 'dark';
      }

      if (prevUserColorScheme === 'dark') {
        return 'light';
      }

      return 'system';
    });
  }, [setUserColorScheme]);

  return [
    userColorScheme === 'system' ? preferredColorScheme : userColorScheme,
    toggleColorScheme,
    userColorScheme,
  ] as const;
};
