import { NitroRenderTexture } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { GetRoomEngine } from '../../../../api';
import { RoomWidgetThumbnailEvent } from '../../../../events/room-widgets/thumbnail';
import { useUiEvent } from '../../../../hooks/events';
import { NitroLayoutMiniCameraView } from '../../../../layout';
import { useRoomContext } from '../../context/RoomContext';

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

    useUiEvent(RoomWidgetThumbnailEvent.SHOW_THUMBNAIL, onNitroEvent);
    useUiEvent(RoomWidgetThumbnailEvent.HIDE_THUMBNAIL, onNitroEvent);
    useUiEvent(RoomWidgetThumbnailEvent.TOGGLE_THUMBNAIL, onNitroEvent);

    const receiveTexture = useCallback((texture: NitroRenderTexture) =>
    {
        GetRoomEngine().saveTextureAsScreenshot(texture, true);

        setIsVisible(false);
    }, []);

    if(!isVisible) return null;

    return <NitroLayoutMiniCameraView roomId={ roomSession.roomId } textureReceiver={ receiveTexture } onClose={ () => setIsVisible(false) } />
};
