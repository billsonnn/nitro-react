import { DesktopViewComposer } from '@nitrots/nitro-renderer';
import { SendMessageComposer } from '../SendMessageComposer';

export function GoToDesktop(): void
{
    SendMessageComposer(new DesktopViewComposer());
}
