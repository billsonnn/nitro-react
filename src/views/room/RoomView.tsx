import { EventDispatcher, Nitro, NitroRectangle, RoomGeometry, RoomVariableEnum, Vector3d } from 'nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { InitializeRoomInstanceRenderingCanvas } from '../../api';
import { DispatchMouseEvent } from '../../api/nitro/room/DispatchMouseEvent';
import { DispatchTouchEvent } from '../../api/nitro/room/DispatchTouchEvent';
import { GetRoomEngine } from '../../api/nitro/room/GetRoomEngine';
import { RoomContextProvider } from './context/RoomContext';
import { RoomWidgetUpdateRoomViewEvent } from './events/RoomWidgetUpdateRoomViewEvent';
import { IRoomWidgetHandlerManager, RoomWidgetAvatarInfoHandler, RoomWidgetChatHandler, RoomWidgetChatInputHandler, RoomWidgetHandlerManager, RoomWidgetInfostandHandler } from './handlers';
import { FurnitureContextMenuWidgetHandler } from './handlers/FurnitureContextMenuWidgetHandler';
import { FurnitureCustomStackHeightWidgetHandler } from './handlers/FurnitureCustomStackHeightWidgetHandler';
import { RoomWidgetRoomToolsHandler } from './handlers/RoomWidgetRoomToolsHandler';
import { RoomColorView } from './RoomColorView';
import { RoomViewProps } from './RoomView.types';
import { RoomWidgetsView } from './widgets/RoomWidgetsView';

export const RoomView: FC<RoomViewProps> = props =>
{
    const { roomSession = null } = props;
    const [ roomCanvas, setRoomCanvas ] = useState<HTMLCanvasElement>(null);
    const [ canvasId, setCanvasId ] = useState(-1);
    const [ widgetHandler, setWidgetHandler ] = useState<IRoomWidgetHandlerManager>(null);

    useEffect(() =>
    {
        if(!roomSession)
        {
            window.onresize = null;

            setRoomCanvas(null);
            setCanvasId(-1);
            setWidgetHandler(null);

            return;
        }

        const widgetHandlerManager = new RoomWidgetHandlerManager(roomSession, new EventDispatcher());

        widgetHandlerManager.registerHandler(new RoomWidgetAvatarInfoHandler());
        widgetHandlerManager.registerHandler(new RoomWidgetInfostandHandler());
        widgetHandlerManager.registerHandler(new RoomWidgetRoomToolsHandler());
        widgetHandlerManager.registerHandler(new RoomWidgetChatInputHandler());
        widgetHandlerManager.registerHandler(new RoomWidgetChatHandler());
        widgetHandlerManager.registerHandler(new FurnitureContextMenuWidgetHandler());
        widgetHandlerManager.registerHandler(new FurnitureCustomStackHeightWidgetHandler());

        setWidgetHandler(widgetHandlerManager);

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

        window.onresize = () =>
        {
            Nitro.instance.renderer.resize(window.innerWidth, window.innerHeight);
            
            InitializeRoomInstanceRenderingCanvas(roomSession.roomId, canvasId, Nitro.instance.width, Nitro.instance.height);

            const bounds = canvas.getBoundingClientRect();
            const rectangle = new NitroRectangle((bounds.x || 0), (bounds.y || 0), (bounds.width || 0), (bounds.height || 0));

            widgetHandlerManager.eventDispatcher.dispatchEvent(new RoomWidgetUpdateRoomViewEvent(RoomWidgetUpdateRoomViewEvent.SIZE_CHANGED, rectangle));

            Nitro.instance.render();
        }

        setRoomCanvas(canvas);
        setCanvasId(canvasId);
    }, [ roomSession ]);

    if(!roomSession) return null;

    return (
        <RoomContextProvider value={ { roomSession, canvasId, eventDispatcher: (widgetHandler && widgetHandler.eventDispatcher), widgetHandler } }>
            <div className="nitro-room w-100 h-100">
               <div id="room-view" className="nitro-room-container"></div>
                { roomCanvas && createPortal(null, document.getElementById('room-view').appendChild(roomCanvas)) }
                { widgetHandler && 
                    <>
                        <RoomColorView />
                        <RoomWidgetsView />
                    </> }
            </div>
        </RoomContextProvider>
    );
}
