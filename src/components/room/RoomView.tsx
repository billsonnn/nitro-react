import { FC, useEffect, useRef } from 'react';
import { DispatchMouseEvent, DispatchTouchEvent, GetNitroInstance } from '../../api';
import { Base } from '../../common';
import { useRoom } from '../../hooks';
import { RoomColorView } from './RoomColorView';
import { RoomContextProvider } from './RoomContext';
import { RoomWidgetsView } from './widgets/RoomWidgetsView';

export const RoomView: FC<{}> = props =>
{
    const { roomSession = null, widgetHandler = null, resize = null } = useRoom();
    const elementRef = useRef<HTMLDivElement>();

    useEffect(() =>
    {
        const canvas = GetNitroInstance().renderer.view;

        if(!canvas) return;

        canvas.onclick = event => DispatchMouseEvent(event);
        canvas.onmousemove = event => DispatchMouseEvent(event);
        canvas.onmousedown = event => DispatchMouseEvent(event);
        canvas.onmouseup = event => DispatchMouseEvent(event);

        canvas.ontouchstart = event => DispatchTouchEvent(event);
        canvas.ontouchmove = event => DispatchTouchEvent(event);
        canvas.ontouchend = event => DispatchTouchEvent(event);
        canvas.ontouchcancel = event => DispatchTouchEvent(event);

        resize();

        const element = elementRef.current;

        if(element) element.appendChild(canvas);

        window.addEventListener('resize', resize);

        return () =>
        {
            if(element) element.removeChild(canvas);
            
            window.removeEventListener('resize', resize);
        }
    }, [ resize ]);

    return (
        <RoomContextProvider value={ { roomSession, eventDispatcher: (widgetHandler && widgetHandler.eventDispatcher), widgetHandler } }>
            <Base fit innerRef={ elementRef } className={ (!roomSession && 'd-none') }>
                { (roomSession && widgetHandler) &&
                    <>
                        <RoomColorView />
                        <RoomWidgetsView />
                    </> }
            </Base>
        </RoomContextProvider>
    );
}
