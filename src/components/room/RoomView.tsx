import { EventDispatcher, IRoomSession, NitroRectangle, RoomGeometry, RoomVariableEnum, Vector3d } from '@nitrots/nitro-renderer';
import { FC, useEffect, useRef, useState } from 'react';
import { DispatchMouseEvent, DispatchTouchEvent, DoorbellWidgetHandler, FriendRequestHandler, FurniChooserWidgetHandler, FurnitureContextMenuWidgetHandler, FurnitureCreditWidgetHandler, FurnitureCustomStackHeightWidgetHandler, FurnitureDimmerWidgetHandler, FurnitureExternalImageWidgetHandler, FurnitureMannequinWidgetHandler, FurniturePresentWidgetHandler, FurnitureYoutubeDisplayWidgetHandler, GetNitroInstance, GetRoomEngine, InitializeRoomInstanceRenderingCanvas, IRoomWidgetHandlerManager, PollWidgetHandler, RoomWidgetAvatarInfoHandler, RoomWidgetChatHandler, RoomWidgetChatInputHandler, RoomWidgetHandlerManager, RoomWidgetInfostandHandler, RoomWidgetRoomToolsHandler, RoomWidgetUpdateRoomViewEvent, UserChooserWidgetHandler, WordQuizWidgetHandler } from '../../api';
import { Base } from '../../common';
import { RoomColorView } from './RoomColorView';
import { RoomContextProvider } from './RoomContext';
import { RoomWidgetsView } from './widgets/RoomWidgetsView';

interface RoomViewProps
{
    roomSession: IRoomSession;
}

export const RoomView: FC<RoomViewProps> = props =>
{
    const { roomSession = null } = props;
    const [ canvasId, setCanvasId ] = useState(-1);
    const [ widgetHandler, setWidgetHandler ] = useState<IRoomWidgetHandlerManager>(null);
    const elementRef = useRef<HTMLDivElement>();

    useEffect(() =>
    {
        if(!roomSession)
        {
            window.onresize = null;

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
        widgetHandlerManager.registerHandler(new UserChooserWidgetHandler());
        widgetHandlerManager.registerHandler(new DoorbellWidgetHandler());
        widgetHandlerManager.registerHandler(new WordQuizWidgetHandler());
        widgetHandlerManager.registerHandler(new PollWidgetHandler());
        widgetHandlerManager.registerHandler(new FriendRequestHandler());

        widgetHandlerManager.registerHandler(new FurniChooserWidgetHandler());
        widgetHandlerManager.registerHandler(new FurnitureContextMenuWidgetHandler());
        widgetHandlerManager.registerHandler(new FurnitureCreditWidgetHandler());
        widgetHandlerManager.registerHandler(new FurnitureCustomStackHeightWidgetHandler());
        widgetHandlerManager.registerHandler(new FurnitureExternalImageWidgetHandler());
        widgetHandlerManager.registerHandler(new FurniturePresentWidgetHandler());
        widgetHandlerManager.registerHandler(new FurnitureDimmerWidgetHandler());
        widgetHandlerManager.registerHandler(new FurnitureYoutubeDisplayWidgetHandler());
        widgetHandlerManager.registerHandler(new FurnitureMannequinWidgetHandler());

        setWidgetHandler(widgetHandlerManager);

        GetNitroInstance().renderer.resize(window.innerWidth, window.innerHeight);

        const canvasId = 1;

        const displayObject = GetRoomEngine().getRoomInstanceDisplay(roomSession.roomId, canvasId, GetNitroInstance().width, GetNitroInstance().height, RoomGeometry.SCALE_ZOOMED_IN);

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

        const stage = GetNitroInstance().stage;

        if(!stage) return;

        stage.addChild(displayObject);

        const canvas = GetNitroInstance().renderer.view;

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
            GetNitroInstance().renderer.resize(window.innerWidth, window.innerHeight);
            
            InitializeRoomInstanceRenderingCanvas(roomSession.roomId, canvasId, GetNitroInstance().width, GetNitroInstance().height);

            const bounds = canvas.getBoundingClientRect();
            const rectangle = new NitroRectangle((bounds.x || 0), (bounds.y || 0), (bounds.width || 0), (bounds.height || 0));

            widgetHandlerManager.eventDispatcher.dispatchEvent(new RoomWidgetUpdateRoomViewEvent(RoomWidgetUpdateRoomViewEvent.SIZE_CHANGED, rectangle));

            GetNitroInstance().render();
        }

        if(elementRef && elementRef.current) elementRef.current.appendChild(canvas);

        setCanvasId(canvasId);
    }, [ roomSession ]);

    if(!roomSession) return null;

    return (
        <RoomContextProvider value={ { roomSession, canvasId, eventDispatcher: (widgetHandler && widgetHandler.eventDispatcher), widgetHandler } }>
            <Base innerRef={ elementRef } id="room-view" className="nitro-room-container" />
            { widgetHandler && 
                <>
                    <RoomColorView />
                    <RoomWidgetsView />
                </> }
        </RoomContextProvider>
    );
}
