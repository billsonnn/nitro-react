import { ColorConverter, NitroAdjustmentFilter, NitroContainer, NitroSprite, NitroTexture, RoomBackgroundColorEvent, RoomEngineDimmerStateEvent, RoomEngineEvent, RoomId, RoomObjectHSLColorEnabledEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { GetNitroInstance, GetRoomEngine, RoomWidgetUpdateBackgroundColorPreviewEvent } from '../../api';
import { UseEventDispatcherHook, UseRoomEngineEvent } from '../../hooks';
import { useRoomContext } from './RoomContext';

export const RoomColorView: FC<{}> = props =>
{
    const [ roomBackground, setRoomBackground ] = useState<NitroSprite>(null);
    const [ roomFilter, setRoomFilter ] = useState<NitroAdjustmentFilter>(null);
    const [ originalRoomBackgroundColor, setOriginalRoomBackgroundColor ] = useState(0);
    const { roomSession = null, widgetHandler = null, eventDispatcher = null } = useRoomContext();

    const updateRoomBackgroundColor = useCallback((hue: number, saturation: number, lightness: number, original: boolean = false) =>
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
    }, [ roomBackground ]);

    const updateRoomFilter = useCallback((color: number) =>
    {
        if(!roomFilter) return;

        const r = ((color >> 16) & 0xFF);
        const g = ((color >> 8) & 0xFF);
        const b = (color & 0xFF);

        roomFilter.red = (r / 255);
        roomFilter.green = (g / 255);
        roomFilter.blue = (b / 255);
    }, [ roomFilter ]);

    const onRoomEngineEvent = useCallback((event: RoomEngineEvent) =>
    {
        if(RoomId.isRoomPreviewerId(event.roomId)) return;

        switch(event.type)
        {
            case RoomObjectHSLColorEnabledEvent.ROOM_BACKGROUND_COLOR: {
                const hslColorEvent = (event as RoomObjectHSLColorEnabledEvent);

                if(hslColorEvent.enable) updateRoomBackgroundColor(hslColorEvent.hue, hslColorEvent.saturation, hslColorEvent.lightness, true);
                else updateRoomBackgroundColor(0, 0, 0, true);

                return;
            }
            case RoomBackgroundColorEvent.ROOM_COLOR: {
                const colorEvent = (event as RoomBackgroundColorEvent);

                let color = 0x000000;
                let brightness = 0xFF;

                if(!colorEvent.bgOnly)
                {
                    color = colorEvent.color;
                    brightness = colorEvent.brightness;
                }
                
                updateRoomFilter(ColorConverter.hslToRGB(((ColorConverter.rgbToHSL(color) & 0xFFFF00) + brightness)));

                return;
            }
            case RoomEngineDimmerStateEvent.ROOM_COLOR: {
                widgetHandler.processEvent(event);
            }
        }
    }, [ widgetHandler, updateRoomBackgroundColor, updateRoomFilter ]);

    UseRoomEngineEvent(RoomObjectHSLColorEnabledEvent.ROOM_BACKGROUND_COLOR, onRoomEngineEvent);
    UseRoomEngineEvent(RoomBackgroundColorEvent.ROOM_COLOR, onRoomEngineEvent);
    UseRoomEngineEvent(RoomEngineDimmerStateEvent.ROOM_COLOR, onRoomEngineEvent);

    const onRoomWidgetUpdateBackgroundColorPreviewEvent = useCallback((event: RoomWidgetUpdateBackgroundColorPreviewEvent) =>
    {
        switch(event.type)
        {
            case RoomWidgetUpdateBackgroundColorPreviewEvent.PREVIEW: {
                updateRoomBackgroundColor(event.hue, event.saturation, event.lightness);
                return;
            }
            case RoomWidgetUpdateBackgroundColorPreviewEvent.CLEAR_PREVIEW: {
                if(!roomBackground) return;

                roomBackground.tint = originalRoomBackgroundColor;
                
                return;
            }
        }
    }, [ roomBackground, originalRoomBackgroundColor, updateRoomBackgroundColor ]);

    UseEventDispatcherHook(RoomWidgetUpdateBackgroundColorPreviewEvent.PREVIEW, eventDispatcher, onRoomWidgetUpdateBackgroundColorPreviewEvent);
    UseEventDispatcherHook(RoomWidgetUpdateBackgroundColorPreviewEvent.CLEAR_PREVIEW, eventDispatcher, onRoomWidgetUpdateBackgroundColorPreviewEvent);

    useEffect(() =>
    {
        if(!roomSession) return;

        const canvas = GetRoomEngine().getRoomInstanceRenderingCanvas(roomSession.roomId, 1);

        if(!canvas) return;

        const background = new NitroSprite(NitroTexture.WHITE);
        const filter = new NitroAdjustmentFilter();
        const master = (canvas.master as NitroContainer);

        background.tint = 0;
        background.width = GetNitroInstance().width;
        background.height = GetNitroInstance().height;

        master.addChildAt(background, 0);
        master.filters = [ filter ];

        setRoomBackground(background);
        setRoomFilter(filter);

        const resize = (event: UIEvent) =>
        {
            background.width = GetNitroInstance().width;
            background.height = GetNitroInstance().height;
        }

        window.addEventListener('resize', resize);

        return () =>
        {
            setRoomBackground(prevValue =>
            {
                if(prevValue) prevValue.destroy();

                return null;
            });

            setRoomFilter(prevValue =>
            {
                if(prevValue) prevValue.destroy();

                return null;
            });
            
            setOriginalRoomBackgroundColor(0);

            window.removeEventListener('resize', resize);
        }
    }, [ roomSession ]);

    return null;
}
