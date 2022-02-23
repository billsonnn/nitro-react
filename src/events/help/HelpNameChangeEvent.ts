import { NitroEvent } from '@nitrots/nitro-renderer/src/core/events/NitroEvent';

export class HelpNameChangeEvent extends NitroEvent
{
    public static INIT: string = 'HC_NAME_CHANGE_INIT';
}
