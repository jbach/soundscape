import { ActionIcon, CopyButton, Sx, Tooltip } from '@mantine/core';
import { IconClipboardCheck, IconLink } from '@tabler/icons-react';

type CopyLinkProps = { sx?: Sx };

const CopyLink = ({ sx = {} }: CopyLinkProps) => {
  return (
    <CopyButton value={window.location.href} timeout={1500}>
      {({ copied, copy }) => (
        <Tooltip label={copied ? 'URL was copied' : 'Copy URL'}>
          <ActionIcon
            onClick={copy}
            color={copied ? 'green' : 'default'}
            sx={sx}
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
