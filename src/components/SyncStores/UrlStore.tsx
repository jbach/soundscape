import { SyncStoreKey } from 'lib/schemas';
import { RecoilURLSyncJSON } from 'recoil-sync';

type UrlStoreProps = { children: React.ReactNode; storeKey?: SyncStoreKey };

const UrlStore = ({ children, storeKey }: UrlStoreProps) => {
  if (!storeKey) {
    return (
      <RecoilURLSyncJSON location={{ part: 'queryParams' }}>
        {children}
      </RecoilURLSyncJSON>
    );
  }

  return (
    <RecoilURLSyncJSON location={{ part: 'queryParams' }} storeKey={storeKey}>
      {children}
    </RecoilURLSyncJSON>
  );
};

export default UrlStore;
