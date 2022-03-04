import { NitroRenderTexture } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { GetRoomEngine } from '../../../../api';
import { LayoutMiniCameraView } from '../../../../common';
import { RoomWidgetThumbnailEvent } from '../../../../events';
import { UseUiEvent } from '../../../../hooks';
import { useRoomContext } from '../../RoomContext';

export const RoomThumbnailWidgetView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const { roomSession = null } = useRoomContext();

    const onNitroEvent = useCallback((event: RoomWidgetThumbnailEvent) =>
    {
        switch(event.type)
        {
            case RoomWidgetThumbnailEvent.SHOW_THUMBNAIL:
                setIsVisible(true);
                return;
            case RoomWidgetThumbnailEvent.HIDE_THUMBNAIL:
                setIsVisible(false);
                return;   
            case RoomWidgetThumbnailEvent.TOGGLE_THUMBNAIL:
                setIsVisible(value => !value);
                return;
        }
    }, []);

    UseUiEvent(RoomWidgetThumbnailEvent.SHOW_THUMBNAIL, onNitroEvent);
    UseUiEvent(RoomWidgetThumbnailEvent.HIDE_THUMBNAIL, onNitroEvent);
    UseUiEvent(RoomWidgetThumbnailEvent.TOGGLE_THUMBNAIL, onNitroEvent);

    const receiveTexture = useCallback((texture: NitroRenderTexture) =>
    {
        GetRoomEngine().saveTextureAsScreenshot(texture, true);

        setIsVisible(false);
    }, []);

    if(!isVisible) return null;

    return <LayoutMiniCameraView roomId={ roomSession.roomId } textureReceiver={ receiveTexture } onClose={ () => setIsVisible(false) } />
};
