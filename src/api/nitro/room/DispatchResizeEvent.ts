import { Nitro } from 'nitro-renderer';
import { InitializeRoomInstanceRenderingCanvas } from './InitializeRoomInstanceRenderingCanvas';

let resizeTimer: ReturnType<typeof setTimeout> = null;

export function WindowResizeEvent(roomId: number, canvasId: number)
{
    if(resizeTimer) clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() =>
    {
        Nitro.instance.renderer.resize(window.innerWidth, window.innerHeight);

        InitializeRoomInstanceRenderingCanvas(roomId, canvasId, Nitro.instance.width, Nitro.instance.height);

        //this._events.dispatchEvent(new RoomWidgetRoomViewUpdateEvent(RoomWidgetRoomViewUpdateEvent.SIZE_CHANGED, this.getRoomViewRect()));

        //this.setRoomBackground();

        Nitro.instance.render();
    }, 1);
}
