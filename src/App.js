import ErrorCatcher from './components/error/ErrorCatcher';
import { IconContext } from 'react-icons';
import PushNotification from './features/notifications/PushNotification';
import PartImagesModal from './components/modal/parts/PartImagesModal';
import TopNav from './features/navigation/TopNav'
import LeftNav from './features/navigation/LeftNav';
import BottomNav from './features/navigation/BottomNav'
import AllRoutes from './AllRoutes';
import { isDesktop } from 'react-device-detect';
import { SnackbarProvider } from 'notistack';

const ICON_SIZE = 20;

function App() {

  return (
    <ErrorCatcher>
      <SnackbarProvider
        maxSnack={3}
        autoHideDuration={2000}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        style={{ marginTop: '55px' }}
      >
        <IconContext.Provider value={{ className: "shared-class", size: ICON_SIZE }}>
          <PushNotification />
          <PartImagesModal />
          <TopNav />
          <AllRoutes />
          {isDesktop ? <LeftNav /> : <BottomNav />}
        </IconContext.Provider>
      </SnackbarProvider>
    </ErrorCatcher>
  );
}

export default App;
