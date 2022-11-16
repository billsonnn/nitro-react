import { ColorConverter, IRoomSession, NitroAdjustmentFilter, NitroContainer, NitroSprite, NitroTexture, RoomBackgroundColorEvent, RoomEngineEvent, RoomEngineObjectEvent, RoomGeometry, RoomId, RoomObjectCategory, RoomObjectHSLColorEnabledEvent, RoomObjectOperationType, RoomSessionEvent, RoomVariableEnum, Vector3d } from '@nitrots/nitro-renderer';
import { useEffect, useState } from 'react';
import { useBetween } from 'use-between';
import { CanManipulateFurniture, DispatchUiEvent, GetNitroInstance, GetRoomEngine, GetRoomSession, InitializeRoomInstanceRenderingCanvas, IsFurnitureSelectionDisabled, ProcessRoomObjectOperation, RoomWidgetUpdateBackgroundColorPreviewEvent, RoomWidgetUpdateRoomObjectEvent, SetActiveRoomId, StartRoomSession } from '../../api';
import { useRoomEngineEvent, useRoomSessionManagerEvent, useUiEvent } from '../events';

const useRoomState = () =>
{
    const [ roomSession, setRoomSession ] = useState<IRoomSession>(null);
    const [ roomBackground, setRoomBackground ] = useState<NitroSprite>(null);
    const [ roomFilter, setRoomFilter ] = useState<NitroAdjustmentFilter>(null);
    const [ originalRoomBackgroundColor, setOriginalRoomBackgroundColor ] = useState(0);

    const updateRoomBackgroundColor = (hue: number, saturation: number, lightness: number, original: boolean = false) =>
    {
        if(!roomBackground) return;

        const newColor = ColorConverter.hslToRGB(((((hue & 0xFF) << 16) + ((saturation & 0xFF) << 8)) + (lightness & 0xFF)));

        if(original) setOriginalRoomBackgroundColor(newColor);

        if(!hue && !saturation && !lightness)
        {
            roomBackground.tint = 0;
        }
        else
        {
            roomBackground.tint = newColor;
        }
    }

    const updateRoomFilter = (color: number) =>
    {
        if(!roomFilter) return;

        const r = ((color >> 16) & 0xFF);
        const g = ((color >> 8) & 0xFF);
        const b = (color & 0xFF);

        roomFilter.red = (r / 255);
        roomFilter.green = (g / 255);
        roomFilter.blue = (b / 255);
    }

    useUiEvent<RoomWidgetUpdateBackgroundColorPreviewEvent>(RoomWidgetUpdateBackgroundColorPreviewEvent.PREVIEW, event => updateRoomBackgroundColor(event.hue, event.saturation, event.lightness));

    useUiEvent<RoomWidgetUpdateBackgroundColorPreviewEvent>(RoomWidgetUpdateBackgroundColorPreviewEvent.CLEAR_PREVIEW, event =>
    {
        if(!roomBackground) return;

        roomBackground.tint = originalRoomBackgroundColor;
    });

    useRoomEngineEvent<RoomObjectHSLColorEnabledEvent>(RoomObjectHSLColorEnabledEvent.ROOM_BACKGROUND_COLOR, event =>
    {
        if(RoomId.isRoomPreviewerId(event.roomId)) return;

        if(event.enable) updateRoomBackgroundColor(event.hue, event.saturation, event.lightness, true);
        else updateRoomBackgroundColor(0, 0, 0, true);
    });

    useRoomEngineEvent<RoomBackgroundColorEvent>(RoomBackgroundColorEvent.ROOM_COLOR, event =>
    {
        if(RoomId.isRoomPreviewerId(event.roomId)) return;

        let color = 0x000000;
        let brightness = 0xFF;

        if(!event.bgOnly)
        {
            color = event.color;
            brightness = event.brightness;
        }

        updateRoomFilter(ColorConverter.hslToRGB(((ColorConverter.rgbToHSL(color) & 0xFFFF00) + brightness)));
    });

    useRoomEngineEvent<RoomEngineEvent>([
        RoomEngineEvent.INITIALIZED,
        RoomEngineEvent.DISPOSED
    ], event =>
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
    });

    useRoomSessionManagerEvent<RoomSessionEvent>([
        RoomSessionEvent.CREATED,
        RoomSessionEvent.ENDED
    ], event =>
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
    });

    useRoomEngineEvent<RoomEngineObjectEvent>([
        RoomEngineObjectEvent.SELECTED,
        RoomEngineObjectEvent.DESELECTED,
        RoomEngineObjectEvent.ADDED,
        RoomEngineObjectEvent.REMOVED,
        RoomEngineObjectEvent.PLACED,
        RoomEngineObjectEvent.REQUEST_MOVE,
        RoomEngineObjectEvent.REQUEST_ROTATE,
        RoomEngineObjectEvent.MOUSE_ENTER,
        RoomEngineObjectEvent.MOUSE_LEAVE,
        RoomEngineObjectEvent.DOUBLE_CLICK
    ], event =>
    {
        if(RoomId.isRoomPreviewerId(event.roomId)) return;

        let updateEvent: RoomWidgetUpdateRoomObjectEvent = null;

        switch(event.type)
        {
            case RoomEngineObjectEvent.SELECTED:
                if(!IsFurnitureSelectionDisabled(event)) updateEvent = new RoomWidgetUpdateRoomObjectEvent(RoomWidgetUpdateRoomObjectEvent.OBJECT_SELECTED, event.objectId, event.category, event.roomId);
                break;
            case RoomEngineObjectEvent.DESELECTED:
                updateEvent = new RoomWidgetUpdateRoomObjectEvent(RoomWidgetUpdateRoomObjectEvent.OBJECT_DESELECTED, event.objectId, event.category, event.roomId);
                break;
            case RoomEngineObjectEvent.ADDED: {
                let addedEventType: string = null;

                switch(event.category)
                {
                    case RoomObjectCategory.FLOOR:
                    case RoomObjectCategory.WALL:
                        addedEventType = RoomWidgetUpdateRoomObjectEvent.FURNI_ADDED;
                        break;
                    case RoomObjectCategory.UNIT:
                        addedEventType = RoomWidgetUpdateRoomObjectEvent.USER_ADDED;
                        break;
                }

                if(addedEventType) updateEvent = new RoomWidgetUpdateRoomObjectEvent(addedEventType, event.objectId, event.category, event.roomId);
                break;
            }
            case RoomEngineObjectEvent.REMOVED: {
                let removedEventType: string = null;

                switch(event.category)
                {
                    case RoomObjectCategory.FLOOR:
                    case RoomObjectCategory.WALL:
                        removedEventType = RoomWidgetUpdateRoomObjectEvent.FURNI_REMOVED;
                        break;
                    case RoomObjectCategory.UNIT:
                        removedEventType = RoomWidgetUpdateRoomObjectEvent.USER_REMOVED;
                        break;
                }

                if(removedEventType) updateEvent = new RoomWidgetUpdateRoomObjectEvent(removedEventType, event.objectId, event.category, event.roomId);
                break;
            }
            case RoomEngineObjectEvent.REQUEST_MOVE:
                if(CanManipulateFurniture(roomSession, event.objectId, event.category)) ProcessRoomObjectOperation(event.objectId, event.category, RoomObjectOperationType.OBJECT_MOVE);
                break;
            case RoomEngineObjectEvent.REQUEST_ROTATE:
                if(CanManipulateFurniture(roomSession, event.objectId, event.category)) ProcessRoomObjectOperation(event.objectId, event.category, RoomObjectOperationType.OBJECT_ROTATE_POSITIVE);
                break;
            case RoomEngineObjectEvent.MOUSE_ENTER:
                updateEvent = new RoomWidgetUpdateRoomObjectEvent(RoomWidgetUpdateRoomObjectEvent.OBJECT_ROLL_OVER, event.objectId, event.category, event.roomId);
                break;
            case RoomEngineObjectEvent.MOUSE_LEAVE:
                updateEvent = new RoomWidgetUpdateRoomObjectEvent(RoomWidgetUpdateRoomObjectEvent.OBJECT_ROLL_OUT, event.objectId, event.category, event.roomId);
                break;
            case RoomEngineObjectEvent.DOUBLE_CLICK:
                updateEvent = new RoomWidgetUpdateRoomObjectEvent(RoomWidgetUpdateRoomObjectEvent.OBJECT_DOUBLE_CLICKED, event.objectId, event.category, event.roomId);
                break;
        }

        if(updateEvent) DispatchUiEvent(updateEvent);
    });

    useEffect(() =>
    {
        if(!roomSession) return;

        const nitroInstance = GetNitroInstance();
        const roomEngine = GetRoomEngine();
        const roomId = roomSession.roomId;
        const canvasId = 1;
        const width = Math.floor(window.innerWidth);
        const height = Math.floor(window.innerHeight);
        const renderer = nitroInstance.application.renderer;

        if(renderer)
        {
            renderer.view.style.width = `${ width }px`;
            renderer.view.style.height = `${ height }px`;
            renderer.resolution = window.devicePixelRatio;
            renderer.resize(width, height);
        }

        const displayObject = roomEngine.getRoomInstanceDisplay(roomId, canvasId, width, height, RoomGeometry.SCALE_ZOOMED_IN);
        const canvas = GetRoomEngine().getRoomInstanceRenderingCanvas(roomId, canvasId);

        if(!displayObject || !canvas) return;

        const background = new NitroSprite(NitroTexture.WHITE);
        const filter = new NitroAdjustmentFilter();
        const master = (canvas.master as NitroContainer);

        background.tint = 0;
        background.width = width;
        background.height = height;

        master.addChildAt(background, 0);
        master.filters = [ filter ];

        setRoomBackground(background);
        setRoomFilter(filter);

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

        const stage = nitroInstance.application.stage;

        if(!stage) return;

        stage.addChild(displayObject);

        SetActiveRoomId(roomSession.roomId);

        const resize = (event: UIEvent) =>
        {
            const width = Math.floor(window.innerWidth);
            const height = Math.floor(window.innerHeight);

            renderer.view.style.width = `${ width }px`;
            renderer.view.style.height = `${ height }px`;
            renderer.resolution = window.devicePixelRatio;
            renderer.resize(width, height);

            background.width = width;
            background.height = height;

            InitializeRoomInstanceRenderingCanvas(width, height, 1);

            nitroInstance.application.render();
        }

        window.addEventListener('resize', resize);

        return () =>
        {
            setRoomBackground(null);
            setRoomFilter(null);
            setOriginalRoomBackgroundColor(0);

            window.removeEventListener('resize', resize);
        }
    }, [ roomSession ]);

    return { roomSession };
}

export const useRoom = () => useBetween(useRoomState);
