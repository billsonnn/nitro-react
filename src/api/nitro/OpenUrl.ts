import { HabboWebTools } from '@nitrots/nitro-renderer';
import { CreateLinkEvent } from './CreateLinkEvent';

export const OpenUrl = (url: string) =>
{
    if(!url || !url.length) return;
    
    if(url.startsWith('http'))
    {
        HabboWebTools.openWebPage(url);
    }
    else
    {
        CreateLinkEvent(url);
    }
}
