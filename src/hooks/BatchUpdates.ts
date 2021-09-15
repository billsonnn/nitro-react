import { unstable_batchedUpdates } from 'react-dom';

export const BatchUpdates = (callback: () => any) =>
{
    return unstable_batchedUpdates(callback);
}
