import { Alert, Center, Code, Container } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { FallbackProps } from 'react-error-boundary';

const FatalError = ({ error }: FallbackProps) => {
  return (
    <Container h='100%' size='xs'>
      <Center h='100%'>
        <Alert
          icon={<IconAlertCircle size='1rem' />}
          title='Bummer!'
          color='red'
        >
          Something terrible happened! You made a mistake and there is no going
          back, your data was lost forever!
          <Code block mt='sm'>
            {error.message}
          </Code>
        </Alert>
      </Center>
    </Container>
  );
};

export default FatalError;
