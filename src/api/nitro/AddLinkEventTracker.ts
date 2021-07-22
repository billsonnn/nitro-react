import { ILinkEventTracker } from 'nitro-renderer';
import { GetNitroInstance } from './GetNitroInstance';

export function AddEventLinkTracker(tracker: ILinkEventTracker): void
{
    GetNitroInstance().addLinkEventTracker(tracker);
}
