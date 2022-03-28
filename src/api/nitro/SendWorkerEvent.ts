import { GetNitroInstance } from './GetNitroInstance';

export const SendWorkerEvent = (message: { [index: string]: any }) =>
{
    GetNitroInstance().sendWorkerEvent(message);
}
