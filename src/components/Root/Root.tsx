import App from 'components/App';
import { RootThemeProvider, UserThemeProvider } from 'components/ThemeProvider';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { RecoilRoot } from 'recoil';
import FatalError from './FatalError';
import Loading from './Loading';
import { LocalStorageStore, UrlStore, YjsStore } from 'components/SyncStores';

const Root = () => {
  return (
    // provides default theme to provide proper styles if FatalError is rendered
    <RootThemeProvider>
      <ErrorBoundary FallbackComponent={FatalError}>
        <RecoilRoot>
          {/* handles pending recoil states */}
          <Suspense fallback={<Loading />}>
            {/* syncs state with URL */}
            <UrlStore storeKey='hash'>
              {/* syncs state with LocalStorage */}
              <LocalStorageStore storeKey='userSettings'>
                {/* syncs state p2p */}
                <YjsStore storeKey='shared'>
                  {/* this ThemeProvider includes user settings, like dark mode */}
                  <UserThemeProvider>
                    <App />
                  </UserThemeProvider>
                </YjsStore>
              </LocalStorageStore>
            </UrlStore>
          </Suspense>
        </RecoilRoot>
      </ErrorBoundary>
    </RootThemeProvider>
  );
};

export default Root;
