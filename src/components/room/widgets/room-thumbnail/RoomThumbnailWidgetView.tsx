import { NitroRenderTexture } from '@nitrots/nitro-renderer';
import { FC, useState } from 'react';
import { GetRoomEngine } from '../../../../api';
import { LayoutMiniCameraView } from '../../../../common';
import { RoomWidgetThumbnailEvent } from '../../../../events';
import { useRoom, useUiEvent } from '../../../../hooks';

export const RoomThumbnailWidgetView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const { roomSession = null } = useRoom();

    useUiEvent([
        RoomWidgetThumbnailEvent.SHOW_THUMBNAIL,
        RoomWidgetThumbnailEvent.HIDE_THUMBNAIL,
        RoomWidgetThumbnailEvent.TOGGLE_THUMBNAIL ], event =>
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
    });

    const receiveTexture = (texture: NitroRenderTexture) =>
    {
        GetRoomEngine().saveTextureAsScreenshot(texture, true);

        setIsVisible(false);
    }

    if(!isVisible) return null;

    return <LayoutMiniCameraView roomId={ roomSession.roomId } textureReceiver={ receiveTexture } onClose={ () => setIsVisible(false) } />
};
