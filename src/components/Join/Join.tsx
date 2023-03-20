import { Button, Center } from '@mantine/core';
import { IconDoorEnter } from '@tabler/icons-react';
import { useHasInteracted } from 'lib/state';
import { getIconProps } from 'lib/theme';

const Join = () => {
  const [, setHasInteracted] = useHasInteracted();

  return (
    <Center h='100%'>
      <Button
        size='lg'
        onClick={() => setHasInteracted(true)}
        leftIcon={<IconDoorEnter {...getIconProps('lg')} />}
      >
        Join Room
      </Button>
    </Center>
  );
};

export default Join;
