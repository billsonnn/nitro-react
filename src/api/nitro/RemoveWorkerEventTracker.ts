import { IWorkerEventTracker } from '@nitrots/nitro-renderer';
import { GetNitroInstance } from './GetNitroInstance';

export const RemoveWorkerEventTracker = (tracker: IWorkerEventTracker) =>
{
    GetNitroInstance().removeWorkerEventTracker(tracker);
}
