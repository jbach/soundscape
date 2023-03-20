import { Howl, Howler } from 'howler';
import { TrackId, Volume } from './schemas';
import { getTrack } from './tracks';
import { perceptualToAmplitude } from '@discordapp/perceptual';

const player = {
  setVolume: (volume: Volume) => {
    Howler.volume(perceptualToAmplitude(volume));
  },
  stop: () => {
    Howler.unload();
  },
  play: (nextTrack: TrackId) => {
    const track = getTrack(nextTrack);

    if (!track) {
      throw new Error(`track with id "${nextTrack}" not found!`);
    }

    Howler.unload();

    new Howl({
      src: track.link,
      html5: true,
      autoplay: true,
      format: ['mp3'],
      loop: true,
    });
  },
};

export default player;
