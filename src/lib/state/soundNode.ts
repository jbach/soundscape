import { DefaultValue, atomFamily, selector, selectorFamily } from 'recoil';
import {
  Sound,
  SoundNode,
  SoundNodeId,
  SoundNodePath,
  SoundNodeState,
  SoundNodeStateSchema,
} from 'lib/schemas';
import { soundFamily } from './sound';
import humanId from 'human-id';
import { getSyncEffect } from './helpers/sync';
import {
  LOCAL_SOUNDSCAPE_NODE_ID,
  ROOT_NODE_ID,
  SHARED_SOUNDSCAPE_NODE_ID,
} from 'lib/constants';
import getLogEffect from './helpers/logEffect';
import syncFaviconEffect from './helpers/syncFaviconEffect';
import { findTrack } from './tracks';

// sync effects
const syncSharedEffect = getSyncEffect('shared', SoundNodeStateSchema);
const syncUserSettingsEffect = getSyncEffect(
  'userSettings',
  SoundNodeStateSchema
);

// each node is represented by its state
export const soundNodeFamily = atomFamily<SoundNodeState, SoundNodeId>({
  key: 'SoundNodeState',
  default: (nodeId) => {
    // root node contains soundscapes
    if (nodeId === ROOT_NODE_ID) {
      return {
        id: ROOT_NODE_ID,
        type: 'root',
        children: [SHARED_SOUNDSCAPE_NODE_ID, LOCAL_SOUNDSCAPE_NODE_ID],
      };
    }

    if (nodeId === LOCAL_SOUNDSCAPE_NODE_ID) {
      return {
        id: LOCAL_SOUNDSCAPE_NODE_ID,
        type: 'group',
        children: [],
      };
    }

    if (nodeId === SHARED_SOUNDSCAPE_NODE_ID) {
      return {
        id: SHARED_SOUNDSCAPE_NODE_ID,
        type: 'group',
        children: [],
      };
    }

    return null;
  },
  effects: (nodeId) => {
    const defaultEffects = [
      getLogEffect(nodeId, 'SoundNode'),
      syncFaviconEffect(nodeId),
    ];

    // root node state should be synced with local storage
    if (nodeId === ROOT_NODE_ID) {
      return [syncUserSettingsEffect, ...defaultEffects];
    }

    return [syncSharedEffect, ...defaultEffects];
  },
});

// -- selectors

// expands SoundNodeState to SoundNode
export const getNode = selectorFamily<SoundNode, SoundNodeId>({
  key: 'SoundNode',
  get:
    (nodeId) =>
    ({ get }) => {
      const nodeState = get(soundNodeFamily(nodeId));

      if (!nodeState) {
        throw new Error(`SoundNode with key ${nodeId} does not present`);
      }

      // get descendant node states
      const children = nodeState.children.map(
        (id: SoundNodeId): SoundNode => get(getNode(id))
      );

      return {
        ...nodeState,
        children: children,
      };
    },
  // pass changes upstream to SoundNodeState atom
  set:
    (nodeId) =>
    ({ get, set, reset }, nextNode) => {
      if (nextNode instanceof DefaultValue) {
        reset(soundNodeFamily(nodeId));
      } else {
        set(soundNodeFamily(nodeId), {
          ...nextNode,
          children: nextNode.children.map((child) => child.id),
        });
      }
    },
});

// get all leaf descendants of a node
export const getNodeLeafs = selectorFamily<SoundNode[], SoundNodeId>({
  key: 'SoundNode/leafs',
  get:
    (nodeId) =>
    ({ get }) => {
      const node = get(getNode(nodeId));
      const reducer = (leafs: SoundNode[], child: SoundNode): SoundNode[] => {
        if (child.children.length === 0) {
          return [...leafs, child];
        }

        return child.children.reduce(reducer, leafs);
      };
      return node.children.reduce(reducer, []);
    },
});

export const getNodeSounds = selectorFamily<Sound[], SoundNodeId>({
  key: 'SoundNode/sounds',
  get:
    (nodeId) =>
    ({ get }) => {
      const leafs = get(getNodeLeafs(nodeId));
      const sounds = leafs.filter((leaf) => leaf.type === 'sound');
      return sounds
        .map(({ id }) => get(soundFamily(id)))
        .filter((sound): sound is Sound => sound !== null);
    },
});

// returns the entire tree
export const getRootNode = selector({
  key: 'SoundRoot',
  get: ({ get }) => get(getNode('root')),
});

// extract store node parents
export const parentIdsState = selector({
  key: 'SoundRoot/parentIds',
  get: ({ get, getCallback }) => {
    const rootNode = get(getRootNode);
    let parents: Record<SoundNodeId, SoundNodeId | null> = {};

    const processPath = (node: SoundNode, parent: SoundNodeId | null) => {
      parents[node.id] = parent;
      if (node.children) {
        node.children.forEach((childNode) => processPath(childNode, node.id));
      }
    };

    processPath(rootNode, null);

    return parents;
  },
});

// returns parent id for given node
export const getParentId = selectorFamily({
  key: 'SoundNode/parentId',
  get:
    (nodeId: SoundNodeId) =>
    ({ get, getCallback }) => {
      const parents = get(parentIdsState);
      return parents[nodeId];
    },
});

// builds path to node
export const getPath = selectorFamily<SoundNodePath, SoundNodeId>({
  key: 'SoundNode/path',
  get:
    (nodeId) =>
    ({ get, getCallback }) => {
      const _getPath = (
        id: SoundNodeId,
        path: SoundNodePath
      ): SoundNodePath => {
        const parentId = get(getParentId(id));

        if (!parentId) {
          return path;
        }

        return _getPath(parentId, [parentId, ...path]);
      };

      return _getPath(nodeId, []);
    },
});

// -- public API
// todo: make singleTrackState
export const currentTrackState = selector({
  key: 'currentTrack',
  get: ({ get, getCallback }) => {
    const sharedSounds = get(getNodeSounds(SHARED_SOUNDSCAPE_NODE_ID));
    if (sharedSounds.length > 0) {
      const track = get(findTrack(sharedSounds[0].trackId));
      return track;
    }
  },
  set: ({ get, set, reset }, newValue) => {
    const sharedSounds = get(getNodeSounds(SHARED_SOUNDSCAPE_NODE_ID));

    if (newValue instanceof DefaultValue || !newValue) {
      if (sharedSounds.length > 0) {
        // stop currently playing sound
        set(soundNodeFamily(SHARED_SOUNDSCAPE_NODE_ID), (localNode) =>
          localNode
            ? {
                ...localNode,
                children: localNode.children.slice(1),
              }
            : null
        );
        reset(soundNodeFamily(sharedSounds[0].id));
        reset(soundFamily(sharedSounds[0].id));
      }

      return;
    }

    if (sharedSounds.length > 0) {
      // replace existing sound
      set(soundFamily(sharedSounds[0].id), {
        id: sharedSounds[0].id,
        trackId: newValue.id,
      });
    } else {
      const nodeId = humanId();
      // play fresh sound
      set(soundFamily(nodeId), {
        id: nodeId,
        trackId: newValue.id,
      });

      // sound node
      set(soundNodeFamily(nodeId), {
        id: nodeId,
        type: 'sound',
        children: [],
      });

      // add sound node to track
      set(soundNodeFamily(SHARED_SOUNDSCAPE_NODE_ID), (localNode) =>
        localNode
          ? {
              ...localNode,
              children: localNode.children.concat(nodeId),
            }
          : {
              id: SHARED_SOUNDSCAPE_NODE_ID,
              type: 'group' as const,
              children: [nodeId],
            }
      );
    }
  },
});
