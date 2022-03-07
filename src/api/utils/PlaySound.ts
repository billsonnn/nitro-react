import { NitroSoundEvent } from '@nitrots/nitro-renderer/src/nitro/events/NitroSoundEvent';
import { DispatchMainEvent } from '../../hooks';

export function PlaySound(sampleCode: string): void
{
    DispatchMainEvent(new NitroSoundEvent(NitroSoundEvent.PLAY_SOUND, sampleCode));
}
