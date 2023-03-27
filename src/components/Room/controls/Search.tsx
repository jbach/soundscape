import { ActionIcon, Sx, TextInput } from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';
import { useTrackSearchInput } from 'lib/state';

type SearchProps = { sx?: Sx };

const Search = ({ sx }: SearchProps) => {
  const [search, setSearch] = useTrackSearchInput();

  return (
    <TextInput
      radius='md'
      placeholder='Search'
      value={search}
      onChange={(e) => {
        setSearch(e.currentTarget.value);
      }}
      icon={<IconSearch size='0.8rem' />}
      rightSection={
        search.length > 0 ? (
          <ActionIcon color='red' onClick={() => setSearch('')}>
            <IconX size='1.125rem' />
          </ActionIcon>
        ) : null
      }
    />
  );
};

export default Search;
