import { ColorConverter, NitroAdjustmentFilter, NitroContainer, NitroSprite, NitroTexture, RoomBackgroundColorEvent, RoomEngineDimmerStateEvent, RoomId, RoomObjectHSLColorEnabledEvent } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { GetNitroInstance, GetRoomEngine, RoomWidgetUpdateBackgroundColorPreviewEvent } from '../../api';
import { useRoom, useRoomEngineEvent, useUiEvent } from '../../hooks';

export const RoomColorView: FC<{}> = props =>
{
    const [ roomBackground, setRoomBackground ] = useState<NitroSprite>(null);
    const [ roomFilter, setRoomFilter ] = useState<NitroAdjustmentFilter>(null);
    const [ originalRoomBackgroundColor, setOriginalRoomBackgroundColor ] = useState(0);
    const { roomSession = null } = useRoom();

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

    useRoomEngineEvent<RoomEngineDimmerStateEvent>(RoomEngineDimmerStateEvent.ROOM_COLOR, event =>
    {
        if(RoomId.isRoomPreviewerId(event.roomId)) return;
    });

    useUiEvent<RoomWidgetUpdateBackgroundColorPreviewEvent>(RoomWidgetUpdateBackgroundColorPreviewEvent.PREVIEW, event => updateRoomBackgroundColor(event.hue, event.saturation, event.lightness));

    useUiEvent<RoomWidgetUpdateBackgroundColorPreviewEvent>(RoomWidgetUpdateBackgroundColorPreviewEvent.CLEAR_PREVIEW, event =>
    {
        if(!roomBackground) return;

        roomBackground.tint = originalRoomBackgroundColor;
    });

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
