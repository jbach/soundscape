import { humanReadableId } from '@alexjamesmalcolm/human-readable-ids';
import { Button, Center } from '@mantine/core';
import { IconMusic } from '@tabler/icons-react';
import { hasInteractedState, roomIdState } from 'lib/state';
import { useRecoilTransaction_UNSTABLE } from 'recoil';

const Welcome = () => {
  // on create: set hash + setHasInteracted
  const createSession = useRecoilTransaction_UNSTABLE(({ set }) => () => {
    set(hasInteractedState, true);
    set(roomIdState, humanReadableId());
  });

  return (
    <Center h='100%'>
      <Button size='lg' onClick={createSession} leftIcon={<IconMusic />}>
        Create Session
      </Button>
    </Center>
  );
};

export default Welcome;
