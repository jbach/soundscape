import { SoundNodeId } from 'lib/schemas';
import { AtomEffect } from 'recoil';

const getLogEffect: (nodeId: SoundNodeId, prefix?: string) => AtomEffect<any> =
  (nodeId, prefix = 'logEffect') =>
  ({
    node,
    trigger, // The action which triggered initialization of the atom
    // Callbacks to set or reset the value of the atom.
    // This can be called from the atom effect function directly to initialize the
    // initial value of the atom, or asynchronously called later to change it.
    setSelf,
    resetSelf,
    // Subscribe to changes in the atom value.
    // The callback is not called due to changes from this effect's own setSelf().
    onSet,
    // Callbacks to read other atoms/selectors
    getPromise,
    // getLoadable: <S>(RecoilValue<S>) => Loadable<S>,
    // getInfo_UNSTABLE: <S>(RecoilValue<S>) => RecoilValueInfo<S>,
  }) => {
    const log: typeof console.log = (...args) =>
      console.log(`[${prefix}/${nodeId}]`, ...args);
    log(`init (trigger: ${trigger})`);

    onSet((newValue, oldValue, isReset) => {
      log(
        `onSet (${isReset ? 'reset' : 'update'})`,
        'newValue:',
        newValue,
        'oldValue:',
        oldValue
      );
    });

    return () => {
      log(`cleanup`);
    };
  };

export default getLogEffect;
