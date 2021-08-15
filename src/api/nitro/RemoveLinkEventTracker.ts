import { ILinkEventTracker } from '@nitrots/nitro-renderer';
import { GetNitroInstance } from './GetNitroInstance';

export function RemoveLinkEventTracker(tracker: ILinkEventTracker): void
{
    GetNitroInstance().removeLinkEventTracker(tracker);
}
