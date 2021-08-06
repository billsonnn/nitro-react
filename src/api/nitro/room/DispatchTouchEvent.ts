import { MouseEventType, TouchEventType } from '@nitrots/nitro-renderer';
import { GetRoomEngine } from './GetRoomEngine';

let didMouseMove = false;
let lastClick = 0;
let clickCount = 0;
let touchTimer: ReturnType<typeof setTimeout> = null;

export function DispatchTouchEvent(roomId: number, canvasId: number, event: TouchEvent, longTouch: boolean = false, altKey: boolean = false, ctrlKey: boolean = false, shiftKey: boolean = false)
{
    let eventType = event.type;

    if(longTouch) eventType = TouchEventType.TOUCH_LONG;

    if(eventType === TouchEventType.TOUCH_END && !didMouseMove)
    {
        eventType = MouseEventType.MOUSE_CLICK;

        if(lastClick)
        {
            clickCount = 1;

            if(lastClick >= (Date.now() - 300)) clickCount++;
        }

        lastClick = Date.now();

        if(clickCount === 2)
        {
            eventType = MouseEventType.DOUBLE_CLICK;

            clickCount    = 0;
            lastClick     = null;
        }
    }

    if(touchTimer) clearTimeout(touchTimer);

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

    switch(eventType)
    {
        case MouseEventType.MOUSE_CLICK:
            break;
        case MouseEventType.DOUBLE_CLICK:
            break;
        case TouchEventType.TOUCH_START:
            touchTimer = setTimeout(() =>
            {
                if(didMouseMove) return;

                DispatchTouchEvent(roomId, canvasId, event, true);
            }, 300);
            
            eventType = MouseEventType.MOUSE_DOWN;

            didMouseMove = false;
            break;
        case TouchEventType.TOUCH_MOVE:
            eventType = MouseEventType.MOUSE_MOVE;

            didMouseMove = true;
            break;
        case TouchEventType.TOUCH_END:
            eventType = MouseEventType.MOUSE_UP;
            break;
        case TouchEventType.TOUCH_LONG:
            eventType = MouseEventType.MOUSE_DOWN_LONG;
            break;
        default: return;
    }

    GetRoomEngine().dispatchMouseEvent(canvasId, x, y, eventType, altKey, ctrlKey, shiftKey, false);
}
