import { GetNitroInstance } from './GetNitroInstance';

export function CreateLinkEvent(link: string): void
{
    link = (link.startsWith('event:') ? link.substring(6) : link);
    
    GetNitroInstance().createLinkEvent(link);
}
