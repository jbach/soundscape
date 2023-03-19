import { ActionIcon, CopyButton, Tooltip } from '@mantine/core';
import { IconClipboardCheck, IconLink } from '@tabler/icons-react';

const CopyLink = () => {
  return (
    <CopyButton value={window.location.href} timeout={1500}>
      {({ copied, copy }) => (
        <Tooltip
          label={copied ? 'URL was copied' : 'Copy URL'}
          withArrow
          position='bottom'
        >
          <ActionIcon
            onClick={copy}
            variant='subtle'
            color={copied ? 'green' : 'default'}
            sx={{ marginLeft: 'auto' }}
          >
            {copied ? (
              <IconClipboardCheck size='1.125rem' />
            ) : (
              <IconLink size='1.125rem' />
            )}
          </ActionIcon>
        </Tooltip>
      )}
    </CopyButton>
  );
};

export default CopyLink;
