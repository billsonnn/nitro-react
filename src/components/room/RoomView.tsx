import { GetRenderer } from '@nitrots/nitro-renderer';
import { FC, useEffect, useRef } from 'react';
import { DispatchMouseEvent, DispatchTouchEvent } from '../../api';
import { useRoom } from '../../hooks';
import { classNames } from '../../layout';
import { RoomSpectatorView } from './spectator/RoomSpectatorView';
import { RoomWidgetsView } from './widgets/RoomWidgetsView';

export const RoomView: FC<{}> = (props) =>
{
    const { roomSession = null } = useRoom();
    const elementRef = useRef<HTMLDivElement>();

    useEffect(() =>
    {
        const canvas = GetRenderer().canvas;

        if(!canvas) return;

        canvas.onclick = (event) => DispatchMouseEvent(event);
        canvas.onmousemove = (event) => DispatchMouseEvent(event);
        canvas.onmousedown = (event) => DispatchMouseEvent(event);
        canvas.onmouseup = (event) => DispatchMouseEvent(event);

        canvas.ontouchstart = (event) => DispatchTouchEvent(event);
        canvas.ontouchmove = (event) => DispatchTouchEvent(event);
        canvas.ontouchend = (event) => DispatchTouchEvent(event);
        canvas.ontouchcancel = (event) => DispatchTouchEvent(event);

        const element = elementRef.current;

        if(!element) return;

        canvas.classList.add('bg-black');

        element.appendChild(canvas);
    }, []);

    return (
        <div
            ref={elementRef}
            className={classNames('size-full', !roomSession && 'hidden')}
        >
            {roomSession && (
                <>
                    <RoomWidgetsView />
                    {roomSession.isSpectator && <RoomSpectatorView />}
                </>
            )}
        </div>
    );
};
