import { NitroRectangle } from 'nitro-renderer';
import { FC, useCallback, useRef } from 'react';
import { GetRoomEngine, GetRoomSession } from '../../../../../../api';
import { DraggableWindow } from '../../../../../../layout';
import { LocalizeText } from '../../../../../../utils/LocalizeText';
import { RoomThumbnailWidgetCameraViewProps } from './RoomThumbnailWidgetCameraView.types';

export const RoomThumbnailWidgetCameraView: FC<RoomThumbnailWidgetCameraViewProps> = props =>
{
    const { onCloseClick = null } = props;

    const cameraFrameRef = useRef<HTMLDivElement>();

    const takePicture = useCallback(() =>
    {
        const frameBounds = cameraFrameRef.current.getBoundingClientRect();

        if(!frameBounds) return;

        const rectangle = new NitroRectangle(Math.floor(frameBounds.x), Math.floor(frameBounds.y), Math.floor(frameBounds.width), Math.floor(frameBounds.height));

        const image = GetRoomEngine().createRoomScreenshot(GetRoomSession().roomId, 1, rectangle, true, true);
        
        onCloseClick();
    }, [ onCloseClick ]);
    
    return (
        <DraggableWindow handle=".nitro-room-thumbnail-camera">
            <div className="nitro-room-thumbnail-camera px-2">
            <div ref={ cameraFrameRef } className={ 'camera-frame' }></div>
                <div className="d-flex align-items-end h-100 pb-2">
                    <button className="btn btn-sm btn-danger w-100 mb-1 me-2" onClick={ onCloseClick }>{ LocalizeText('cancel') }</button>
                    <button className="btn btn-sm btn-success w-100 mb-1" onClick={ () => takePicture() }>{ LocalizeText('navigator.thumbeditor.save') }</button>
                </div>
            </div>
        </DraggableWindow>
    );
};
