import { NitroSoundEvent } from '@nitrots/nitro-renderer/src/nitro/events/NitroSoundEvent';
import { dispatchMainEvent } from '../../hooks';

export function PlaySound(sampleCode: string): void
{
    dispatchMainEvent(new NitroSoundEvent(NitroSoundEvent.PLAY_SOUND, sampleCode));
}

export const CAMERA_SHUTTER = 'camera_shutter';
export const CREDITS = 'credits';
export const DUCKETS = 'duckets';
export const MESSENGER_NEW_THREAD = 'messenger_new_thread';
export const MESSENGER_MESSAGE_RECEIVED = 'messenger_message_received';
export const MODTOOLS_NEW_TICKET = 'modtools_new_ticket';
