import { Button, Center } from '@mantine/core';
import { IconDoorEnter } from '@tabler/icons-react';
import { useHasInteracted } from 'lib/state';

const Join = () => {
  const [, setHasInteracted] = useHasInteracted();

  return (
    <Center h='100%'>
      <Button
        size='lg'
        onClick={() => setHasInteracted(true)}
        leftIcon={<IconDoorEnter />}
      >
        Join Room
      </Button>
    </Center>
  );
};

export default Join;
