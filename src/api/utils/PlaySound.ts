import { NitroSoundEvent } from '@nitrots/nitro-renderer/src/nitro/events/NitroSoundEvent';
import { dispatchMainEvent } from '../../hooks';

export function PlaySound(sampleCode: string): void
{
    dispatchMainEvent(new NitroSoundEvent(NitroSoundEvent.PLAY_SOUND, sampleCode));
}
