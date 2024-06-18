import { GetRoomEngine, MouseEventType, TouchEventType } from '@nitrots/nitro-renderer';

let didMouseMove = false;
let lastClick = 0;
let clickCount = 0;

export const DispatchTouchEvent = (event: TouchEvent, canvasId: number = 1, longTouch: boolean = false, altKey: boolean = false, ctrlKey: boolean = false, shiftKey: boolean = false) =>
{
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

    let eventType = event.type;

    if(longTouch) eventType = TouchEventType.TOUCH_LONG;

    if(eventType === MouseEventType.MOUSE_CLICK || eventType === TouchEventType.TOUCH_END)
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
            if(!didMouseMove) eventType = MouseEventType.DOUBLE_CLICK;

            clickCount = 0;
            lastClick = null;
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
        case TouchEventType.TOUCH_END:
            eventType = MouseEventType.MOUSE_UP;
            break;
        case TouchEventType.TOUCH_LONG:
            eventType = MouseEventType.MOUSE_DOWN_LONG;
            break;
        default: return;
    }

    if(eventType === TouchEventType.TOUCH_START)
    {
        GetRoomEngine().dispatchMouseEvent(canvasId, x, y, eventType, altKey, ctrlKey, shiftKey, false);
    }

    GetRoomEngine().dispatchMouseEvent(canvasId, x, y, eventType, altKey, ctrlKey, shiftKey, false);
};
