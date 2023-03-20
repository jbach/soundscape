import { ActionIcon, CopyButton, Sx, Tooltip } from '@mantine/core';
import { IconClipboardCheck, IconLink } from '@tabler/icons-react';
import { getIconProps } from 'lib/theme';

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
              <IconClipboardCheck {...getIconProps('md')} />
            ) : (
              <IconLink {...getIconProps('md')} />
            )}
          </ActionIcon>
        </Tooltip>
      )}
    </CopyButton>
  );
};

export default CopyLink;
