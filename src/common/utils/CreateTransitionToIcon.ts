import { NitroToolbarAnimateIconEvent } from '@nitrots/nitro-renderer';
import { GetRoomEngine } from '../../api';

export const CreateTransitionToIcon = (image: HTMLImageElement, fromElement: HTMLElement, icon: string) =>
{
    const bounds = fromElement.getBoundingClientRect();
    const x = (bounds.x + (bounds.width / 2));
    const y = (bounds.y + (bounds.height / 2));
    const event = new NitroToolbarAnimateIconEvent(image, x, y);

    event.iconName = icon;

    GetRoomEngine().events.dispatchEvent(event);
}
