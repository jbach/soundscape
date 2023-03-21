import { SyncStoreKey } from 'lib/schemas';
import { ListenToItems, ReadItem, RecoilSync, WriteItems } from 'recoil-sync';
import { DefaultValue } from 'recoil';
import { useCallback } from 'react';

const DEFAULT_VALUE = new DefaultValue();

type LocalStorageStoreProps = {
  children: React.ReactNode;
  storeKey?: SyncStoreKey;
};

const LocalStorageStore = ({ children, storeKey }: LocalStorageStoreProps) => {
  const getKey = useCallback(
    (itemKey: string) => (storeKey ? `${storeKey}.${itemKey}` : itemKey),
    [storeKey]
  );

  // read atom from localstorage
  const read = useCallback<ReadItem>(
    (itemKey) => {
      const item = localStorage.getItem(getKey(itemKey));

      if (item === null) {
        return DEFAULT_VALUE;
      }

      if (item === 'undefined') {
        return undefined;
      }

      try {
        return JSON.parse(item);
      } catch (error) {
        console.warn(
          { error, itemKey, item },
          'LocalStorageStore: parseJSON failed'
        );
        return DEFAULT_VALUE;
      }
    },
    [getKey]
  );

  // write atom to localStorage
  const write = useCallback<WriteItems>(
    ({ diff }) => {
      for (const [itemKey, value] of diff) {
        if (value instanceof DefaultValue) {
          localStorage.removeItem(getKey(itemKey));
        } else {
          // reasons for setItem to fail: https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem#exceptions
          try {
            localStorage.setItem(getKey(itemKey), JSON.stringify(value));
          } catch (err) {
            console.warn(
              { err, itemKey, value },
              'LocalStorageStore: localStorage.setItem failed'
            );
          }
        }
      }
    },
    [getKey]
  );

  // listen for specific changes in LocalStorage
  const listen: ListenToItems = useCallback(
    ({ updateItem, updateAllKnownItems }) => {
      const onStorage = (event: StorageEvent) => {
        if (
          event.storageArea === localStorage &&
          event.key !== null &&
          (!storeKey || event.key.startsWith(storeKey + '.'))
        ) {
          const [storeOrItemKey, ...rest] = event.key.split('.');
          const itemKey = rest.length > 0 ? rest.join('.') : storeOrItemKey;

          if (event.newValue === null || event.newValue === 'undefined') {
            updateItem(itemKey, DEFAULT_VALUE);
            return;
          }

          try {
            updateItem(itemKey, JSON.parse(event.newValue));
          } catch (err) {
            console.warn(
              { err, event, itemKey },
              'LocalStorageStore: parseJSON failed'
            );
            updateItem(itemKey, DEFAULT_VALUE);
          }
        }
      };

      window.addEventListener('storage', onStorage);

      return () => window.removeEventListener('storage', onStorage);
    },
    [storeKey]
  );

  if (!storeKey) {
    return (
      <RecoilSync read={read} write={write} listen={listen}>
        {children}
      </RecoilSync>
    );
  }

  return (
    <RecoilSync storeKey={storeKey} read={read} write={write} listen={listen}>
      {children}
    </RecoilSync>
  );
};

export default LocalStorageStore;
