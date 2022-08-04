import { IWorkerEventTracker } from '@nitrots/nitro-renderer';
import { GetNitroInstance } from './GetNitroInstance';

export const AddWorkerEventTracker = (tracker: IWorkerEventTracker) =>
{
    GetNitroInstance().addWorkerEventTracker(tracker);
}
