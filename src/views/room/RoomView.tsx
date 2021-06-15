import { Nitro, RoomGeometry, RoomVariableEnum, Vector3d } from 'nitro-renderer';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { DispatchMouseEvent } from '../../api/nitro/room/DispatchMouseEvent';
import { WindowResizeEvent } from '../../api/nitro/room/DispatchResizeEvent';
import { DispatchTouchEvent } from '../../api/nitro/room/DispatchTouchEvent';
import { GetRoomEngine } from '../../api/nitro/room/GetRoomEngine';
import { RoomViewProps } from './RoomView.types';
import { AvatarInfoWidgetView } from './widgets/avatar-info/AvatarInfoWidgetView';
import { CameraWidgetView } from './widgets/camera/CameraWidgetView';
import { ChatInputView } from './widgets/chat-input/ChatInputView';
import { ChatWidgetView } from './widgets/chat/ChatWidgetView';
import { FurnitureWidgetsView } from './widgets/furniture/FurnitureWidgetsView';
import { InfoStandWidgetView } from './widgets/infostand/InfoStandWidgetView';

export function RoomView(props: RoomViewProps): JSX.Element
{
    const { roomSession = null, events = null } = props;
    const [ roomCanvas, setRoomCanvas ] = useState<HTMLCanvasElement>(null);

    useEffect(() =>
    {
        if(!roomSession || !events)
        {
            window.onresize = null;

            setRoomCanvas(null);

            return;
        }

        Nitro.instance.renderer.resize(window.innerWidth, window.innerHeight);

        const canvasId = 1;
        
        const displayObject = GetRoomEngine().getRoomInstanceDisplay(roomSession.roomId, canvasId, Nitro.instance.width, Nitro.instance.height, RoomGeometry.SCALE_ZOOMED_IN);

        if(!displayObject) return;

        const geometry = (GetRoomEngine().getRoomInstanceGeometry(roomSession.roomId, canvasId) as RoomGeometry);

        if(geometry)
        {
            const minX = (GetRoomEngine().getRoomInstanceVariable<number>(roomSession.roomId, RoomVariableEnum.ROOM_MIN_X) || 0);
            const maxX = (GetRoomEngine().getRoomInstanceVariable<number>(roomSession.roomId, RoomVariableEnum.ROOM_MAX_X) || 0);
            const minY = (GetRoomEngine().getRoomInstanceVariable<number>(roomSession.roomId, RoomVariableEnum.ROOM_MIN_Y) || 0);
            const maxY = (GetRoomEngine().getRoomInstanceVariable<number>(roomSession.roomId, RoomVariableEnum.ROOM_MAX_Y) || 0);

            let x = ((minX + maxX) / 2);
            let y = ((minY + maxY) / 2);

            const offset = 20;

            x = (x + (offset - 1));
            y = (y + (offset - 1));

            const z = (Math.sqrt(((offset * offset) + (offset * offset))) * Math.tan(((30 / 180) * Math.PI)));

            geometry.location = new Vector3d(x, y, z);
        }

        const stage = Nitro.instance.stage;

        if(!stage) return;

        stage.addChild(displayObject);

        const canvas = Nitro.instance.renderer.view;

        if(!canvas) return;

        canvas.onclick          = event => DispatchMouseEvent(roomSession.roomId, canvasId, event);
        canvas.onmousemove      = event => DispatchMouseEvent(roomSession.roomId, canvasId, event);
        canvas.onmousedown      = event => DispatchMouseEvent(roomSession.roomId, canvasId, event);
        canvas.onmouseup        = event => DispatchMouseEvent(roomSession.roomId, canvasId, event);

        canvas.ontouchstart     = event => DispatchTouchEvent(roomSession.roomId, canvasId, event);
        canvas.ontouchmove      = event => DispatchTouchEvent(roomSession.roomId, canvasId, event);
        canvas.ontouchend       = event => DispatchTouchEvent(roomSession.roomId, canvasId, event);
        canvas.ontouchcancel    = event => DispatchTouchEvent(roomSession.roomId, canvasId, event);

        window.onresize = event => WindowResizeEvent(roomSession.roomId, canvasId);

        setRoomCanvas(canvas);

    }, [ roomSession, events ]);

    if(!roomSession) return null;

    return (
        <div className="nitro-room w-100 h-100">
            { roomSession && <div id="room-view" className="nitro-room-container"></div> }
            { roomSession && events && roomCanvas &&
                createPortal(props.children, document.getElementById('room-view').appendChild(roomCanvas)) &&
                <>
                    <AvatarInfoWidgetView events={ events } />
                    <CameraWidgetView />
                    <ChatWidgetView />
                    <ChatInputView />
                    <FurnitureWidgetsView events={ events } />
                    <InfoStandWidgetView events={ events } />
                </> }
        </div>
    );
}
