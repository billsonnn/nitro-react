import { ILinkEventTracker } from '@nitrots/nitro-renderer';
import { GetNitroInstance } from './GetNitroInstance';

export function AddEventLinkTracker(tracker: ILinkEventTracker): void
{
    GetNitroInstance().addLinkEventTracker(tracker);
}
