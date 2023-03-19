import Join from 'components/Join';
import Room from 'components/Room';
import Welcome from 'components/Welcome';
import { useHasInteracted, useRoomId } from 'lib/state';

const App = () => {
  const [hasInteracted] = useHasInteracted();
  const [roomId] = useRoomId();

  return roomId ? hasInteracted ? <Room /> : <Join /> : <Welcome />;
};

export default App;
