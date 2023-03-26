import { SyncStoreKey } from 'lib/schemas';
import { ListenToItems, ReadItem, RecoilSync, WriteItems } from 'recoil-sync';
import { DefaultValue } from 'recoil';
import { useCallback, useEffect, useRef } from 'react';
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { useRoomId } from 'lib/state';

const DEFAULT_VALUE = new DefaultValue();

type YjsStoreProps = {
  children: React.ReactNode;
  storeKey?: SyncStoreKey;
  providerKind?: 'webrtc';
};

// todo: allow provider setting
const YjsStore = ({
  children,
  storeKey,
  providerKind = 'webrtc',
}: YjsStoreProps) => {
  // initialize yjs
  const ydoc = useRef(new Y.Doc());
  const ymap = useRef(ydoc.current.getMap(storeKey));
  const provider = useRef<WebrtcProvider>();

  // room could not be initialied yet
  const [roomId] = useRoomId();
  useEffect(() => {
    if (roomId) {
      if (provider.current) {
        provider.current.destroy();
      }

      if (providerKind === 'webrtc') {
        provider.current = new WebrtcProvider(roomId, ydoc.current);
      }
    }
  }, [roomId, providerKind]);

  // read atom from yjs
  const read = useCallback<ReadItem>((itemKey) => {
    const value = ymap.current.get(itemKey);
    if (typeof value === 'undefined') {
      return DEFAULT_VALUE;
    }

    return ymap.current.get(itemKey);
  }, []);

  // write atom to yjs
  const write = useCallback<WriteItems>(({ diff, allItems }) => {
    for (const [itemKey, value] of diff) {
      if (value instanceof DefaultValue) {
        ymap.current.delete(itemKey);
      } else {
        ymap.current.set(itemKey, value);
      }
    }
  }, []);

  // listen for specific changes in yjs
  const listen: ListenToItems = useCallback(({ updateItems }) => {
    const onUpdate = ({ changes }: Y.YMapEvent<unknown>) => {
      const changeSet = Array.from(changes.keys).map(([key, { action }]) => {
        if (action === 'delete') {
          return [key, DEFAULT_VALUE] as const;
        }

        return [key, ymap.current.get(key)] as const;
      });
      updateItems(new Map(changeSet));
    };

    ymap.current.observe(onUpdate);

    return () => ymap.current.unobserve(onUpdate);
  }, []);

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

export default YjsStore;
