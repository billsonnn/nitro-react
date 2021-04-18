import { MouseEventType, TouchEventType } from 'nitro-renderer';
import { GetRoomEngine } from './GetRoomEngine';

let didMouseMove = false;
let lastClick = 0;
let clickCount = 0;

export function DispatchTouchEvent(roomId: number, canvasId: number, event: TouchEvent)
{
    let eventType = event.type;

    if(eventType === TouchEventType.TOUCH_END && !didMouseMove)
    {
        eventType = MouseEventType.MOUSE_CLICK;

        if(lastClick)
        {
            clickCount = 1;

            if(lastClick >= Date.now() - 300) clickCount++;
        }

        lastClick = Date.now();

        if(clickCount === 2)
        {
            eventType = MouseEventType.DOUBLE_CLICK;

            clickCount    = 0;
            lastClick     = null;
        }
    }

    switch(eventType)
    {
        case MouseEventType.MOUSE_CLICK:
            break;
        case MouseEventType.DOUBLE_CLICK:
            break;
        case TouchEventType.TOUCH_START:
            eventType = MouseEventType.MOUSE_DOWN;

            didMouseMove = false;
            break;
        case TouchEventType.TOUCH_MOVE:
            eventType = MouseEventType.MOUSE_MOVE;

            didMouseMove = true;
            break;
        default: return;
    }

    let x = 0;
    let y = 0;

    if(event.touches[0])
    {
        x = event.touches[0].clientX;
        y = event.touches[0].clientY;
    }

    else if(event.changedTouches[0])
    {
        x = event.changedTouches[0].clientX;
        y = event.changedTouches[0].clientY;
    }

    GetRoomEngine().setActiveRoomId(roomId);
    GetRoomEngine().dispatchMouseEvent(canvasId, x, y, eventType, event.altKey, (event.ctrlKey || event.metaKey), event.shiftKey, false);
}
