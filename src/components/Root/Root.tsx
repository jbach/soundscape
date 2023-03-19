import App from 'components/App';
import { RootThemeProvider, UserThemeProvider } from 'components/ThemeProvider';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { RecoilRoot } from 'recoil';
import FatalError from './FatalError';
import Loading from './Loading';
import LocalStorageStore from './LocalStorageStore';
import YjsStore from './YjsStore';
import { RecoilURLSyncJSON } from 'recoil-sync';

const Root = () => {
  return (
    <RootThemeProvider>
      <ErrorBoundary FallbackComponent={FatalError}>
        <RecoilRoot>
          <Suspense fallback={<Loading />}>
            <RecoilURLSyncJSON
              location={{ part: 'queryParams' }}
              storeKey='hash'
            >
              <LocalStorageStore storeKey='userSettings'>
                <YjsStore storeKey='shared'>
                  <UserThemeProvider>
                    <App />
                  </UserThemeProvider>
                </YjsStore>
              </LocalStorageStore>
            </RecoilURLSyncJSON>
          </Suspense>
        </RecoilRoot>
      </ErrorBoundary>
    </RootThemeProvider>
  );
};

export default Root;
