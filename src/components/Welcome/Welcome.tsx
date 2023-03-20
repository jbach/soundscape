import { Button, Center } from '@mantine/core';
import { IconMusic } from '@tabler/icons-react';
import humanId from 'human-id';
import { hasInteractedState, roomIdState } from 'lib/state';
import { getIconProps } from 'lib/theme';
import { useRecoilTransaction_UNSTABLE } from 'recoil';

const Welcome = () => {
  // on create: set hash + setHasInteracted
  const createSession = useRecoilTransaction_UNSTABLE(({ set }) => () => {
    set(hasInteractedState, true);
    set(roomIdState, humanId());
  });

  return (
    <Center h='100%'>
      <Button
        size='lg'
        onClick={createSession}
        leftIcon={<IconMusic {...getIconProps('lg')} />}
      >
        Create Session
      </Button>
    </Center>
  );
};

export default Welcome;
