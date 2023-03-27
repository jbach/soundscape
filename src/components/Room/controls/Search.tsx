import { ActionIcon, Sx, TextInput } from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';
import { searchState } from 'lib/state';
import { useRecoilState } from 'recoil';

type SearchProps = { sx?: Sx };

const Search = ({ sx }: SearchProps) => {
  const [search, setSearch] = useRecoilState(searchState);

  return (
    <TextInput
      radius='md'
      placeholder='Search'
      value={search}
      onChange={(e) => {
        // todo: reset pagination
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
