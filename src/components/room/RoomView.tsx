import { EventDispatcher, IRoomSession, RoomEngineEvent, RoomGeometry, RoomId, RoomSessionEvent, RoomVariableEnum, Vector3d } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { DispatchMouseEvent, DispatchTouchEvent, FurniChooserWidgetHandler, FurnitureContextMenuWidgetHandler, FurnitureCreditWidgetHandler, FurnitureCustomStackHeightWidgetHandler, FurnitureDimmerWidgetHandler, FurnitureExternalImageWidgetHandler, FurnitureInternalLinkHandler, FurnitureMannequinWidgetHandler, FurniturePresentWidgetHandler, FurnitureRoomLinkHandler, FurnitureYoutubeDisplayWidgetHandler, GetNitroInstance, GetRoomEngine, GetRoomSession, InitializeRoomInstanceRenderingCanvas, IRoomWidgetHandlerManager, PollWidgetHandler, RoomWidgetAvatarInfoHandler, RoomWidgetChatHandler, RoomWidgetChatInputHandler, RoomWidgetHandlerManager, RoomWidgetInfostandHandler, SetActiveRoomId, StartRoomSession, UserChooserWidgetHandler, WordQuizWidgetHandler } from '../../api';
import { Base } from '../../common';
import { UseRoomEngineEvent, UseRoomSessionManagerEvent } from '../../hooks';
import { RoomColorView } from './RoomColorView';
import { RoomContextProvider } from './RoomContext';
import { RoomSpectatorView } from './spectator/RoomSpectatorView';
import { RoomWidgetsView } from './widgets/RoomWidgetsView';

export const RoomView: FC<{}> = props =>
{
    const [ roomSession, setRoomSession ] = useState<IRoomSession>(null);
    const [ widgetHandler, setWidgetHandler ] = useState<IRoomWidgetHandlerManager>(null);
    const elementRef = useRef<HTMLDivElement>();

    const onRoomEngineEvent = useCallback((event: RoomEngineEvent) =>
    {
        if(RoomId.isRoomPreviewerId(event.roomId)) return;

        const session = GetRoomSession();

        if(!session) return;

        switch(event.type)
        {
            case RoomEngineEvent.INITIALIZED:
                SetActiveRoomId(event.roomId);
                setRoomSession(session);
                return;
            case RoomEngineEvent.DISPOSED:
                setRoomSession(null);
                return;
        }
    }, []);

    UseRoomEngineEvent(RoomEngineEvent.INITIALIZED, onRoomEngineEvent);
    UseRoomEngineEvent(RoomEngineEvent.DISPOSED, onRoomEngineEvent);

    const onRoomSessionEvent = useCallback((event: RoomSessionEvent) =>
    {
        switch(event.type)
        {
            case RoomSessionEvent.CREATED:
                StartRoomSession(event.session);
                return;
            case RoomSessionEvent.ENDED:
                setRoomSession(null);
                return;
        }
    }, []);

    UseRoomSessionManagerEvent(RoomSessionEvent.CREATED, onRoomSessionEvent);
    UseRoomSessionManagerEvent(RoomSessionEvent.ENDED, onRoomSessionEvent);

    const resize = useCallback((event: UIEvent = null) =>
    {
        const canvas = GetNitroInstance().renderer.view;

        if(!canvas) return;

        canvas.style.width = `${ Math.floor(window.innerWidth) }px`;
        canvas.style.height = `${ Math.floor(window.innerHeight) }px`;
    
        const nitroInstance = GetNitroInstance();

        nitroInstance.renderer.resolution = window.devicePixelRatio;
        nitroInstance.renderer.resize(window.innerWidth, window.innerHeight);
        
        InitializeRoomInstanceRenderingCanvas(window.innerWidth, window.innerHeight, 1);

        nitroInstance.render();
    }, []);

    useEffect(() =>
    {
        if(!roomSession)
        {
            setWidgetHandler(null);

            return;
        }

        const widgetHandlerManager = new RoomWidgetHandlerManager(roomSession, new EventDispatcher());

        widgetHandlerManager.registerHandler(new RoomWidgetAvatarInfoHandler());
        widgetHandlerManager.registerHandler(new RoomWidgetInfostandHandler());
        widgetHandlerManager.registerHandler(new RoomWidgetChatInputHandler());
        widgetHandlerManager.registerHandler(new RoomWidgetChatHandler());
        widgetHandlerManager.registerHandler(new UserChooserWidgetHandler());
        widgetHandlerManager.registerHandler(new WordQuizWidgetHandler());
        widgetHandlerManager.registerHandler(new PollWidgetHandler());

        widgetHandlerManager.registerHandler(new FurniChooserWidgetHandler());
        widgetHandlerManager.registerHandler(new FurnitureContextMenuWidgetHandler());
        widgetHandlerManager.registerHandler(new FurnitureCreditWidgetHandler());
        widgetHandlerManager.registerHandler(new FurnitureCustomStackHeightWidgetHandler());
        widgetHandlerManager.registerHandler(new FurnitureExternalImageWidgetHandler());
        widgetHandlerManager.registerHandler(new FurniturePresentWidgetHandler());
        widgetHandlerManager.registerHandler(new FurnitureDimmerWidgetHandler());
        widgetHandlerManager.registerHandler(new FurnitureYoutubeDisplayWidgetHandler());
        widgetHandlerManager.registerHandler(new FurnitureMannequinWidgetHandler());
        widgetHandlerManager.registerHandler(new FurnitureInternalLinkHandler());
        widgetHandlerManager.registerHandler(new FurnitureRoomLinkHandler());

        setWidgetHandler(widgetHandlerManager);

        const roomEngine = GetRoomEngine();
        const roomId = roomSession.roomId;
        const canvasId = 1;

        resize();

        const displayObject = roomEngine.getRoomInstanceDisplay(roomId, canvasId, window.innerWidth, window.innerHeight, RoomGeometry.SCALE_ZOOMED_IN);

        if(!displayObject) return;

        const geometry = (roomEngine.getRoomInstanceGeometry(roomId, canvasId) as RoomGeometry);

        if(geometry)
        {
            const minX = (roomEngine.getRoomInstanceVariable<number>(roomId, RoomVariableEnum.ROOM_MIN_X) || 0);
            const maxX = (roomEngine.getRoomInstanceVariable<number>(roomId, RoomVariableEnum.ROOM_MAX_X) || 0);
            const minY = (roomEngine.getRoomInstanceVariable<number>(roomId, RoomVariableEnum.ROOM_MIN_Y) || 0);
            const maxY = (roomEngine.getRoomInstanceVariable<number>(roomId, RoomVariableEnum.ROOM_MAX_Y) || 0);

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

        SetActiveRoomId(roomSession.roomId);
    }, [ roomSession, resize ]);

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
                        { roomSession.isSpectator && <RoomSpectatorView /> }
                    </> }
            </Base>
        </RoomContextProvider>
    );
}
