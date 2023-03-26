import { AtomEffect } from 'recoil';
import defaultFavicon from 'img/favicon.svg';
import playingFavicon from 'img/playing.svg';
import { SoundNodeId, SoundNodeState } from 'lib/schemas';
import { SHARED_SOUNDSCAPE_NODE_ID } from 'lib/constants';
import { getNodeSounds } from '../soundNode';

class FaviconManager {
  private static instance?: FaviconManager;
  private static element?: HTMLLinkElement;
  private static state: 'play' | 'default' = 'default';

  private constructor() {}

  private static getElement() {
    if (this.element) {
      return this.element;
    }

    // delete existing favicons
    const existingElements =
      document.querySelectorAll<HTMLLinkElement>('link[rel*="icon"]');
    existingElements.forEach((element) => document.head.removeChild(element));

    // create favicon
    const element = document.createElement('link');
    element.rel = 'shortcut icon';
    document.querySelector('head')?.appendChild(element);
    element.setAttribute('type', 'image/svg+xml');
    element.setAttribute('href', defaultFavicon);

    this.element = element;
    return element;
  }

  static play() {
    if (this.state !== 'play') {
      this.state = 'play';
      this.getElement().setAttribute('href', playingFavicon);
    }
  }

  static stop() {
    if (this.state !== 'default') {
      this.state = 'default';
      this.getElement().setAttribute('href', defaultFavicon);
    }
  }
}

/**
 * syncs playstate with favicon
 */
const syncFaviconEffect: (nodeId: SoundNodeId) => AtomEffect<SoundNodeState> =
  (nodeId) =>
  ({ onSet, node, getPromise, trigger }) => {
    // // set initial value
    // if (trigger === 'get') {
    //   getPromise(node).then((initialTrack) => {
    //     if (initialTrack) {
    //       element.setAttribute('href', playingFavicon);
    //     }
    //   });
    // }
    // // on update of currentTrackid, change favicon
    onSet(async () => {
      const sharedSounds = await getPromise(
        getNodeSounds(SHARED_SOUNDSCAPE_NODE_ID)
      );
      if (sharedSounds.length > 0) {
        FaviconManager.play();
      } else {
        FaviconManager.stop();
      }
    });
  };

export default syncFaviconEffect;
