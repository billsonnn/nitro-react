import { GetNitroInstance } from './GetNitroInstance';

export function CreateLinkEvent(link: string): void
{
    GetNitroInstance().createLinkEvent(link);
}
