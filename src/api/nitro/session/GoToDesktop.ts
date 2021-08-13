import { DesktopViewComposer } from '@nitrots/nitro-renderer';
import { SendMessageHook } from '../../../hooks';

export function GoToDesktop(): void
{
    SendMessageHook(new DesktopViewComposer());
}
