import { NitroRectangle } from 'nitro-renderer';
import { FC, useCallback, useRef, useState } from 'react';
import { GetRoomEngine, GetRoomSession } from '../../../../api';
import { RoomWidgetCameraEvent } from '../../../../events/room-widgets/camera/RoomWidgetCameraEvent';
import { DraggableWindow } from '../../../../hooks/draggable-window/DraggableWindow';
import { useUiEvent } from '../../../../hooks/events/ui/ui-event';
import { CameraWidgetViewProps } from './CameraWidgetView.types';

export const CameraWidgetView: FC<CameraWidgetViewProps> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const cameraFrameRef = useRef<HTMLDivElement>();

    const onRoomWidgetCameraEvent = useCallback((event: RoomWidgetCameraEvent) =>
    {
        switch(event.type)
        {
            case RoomWidgetCameraEvent.SHOW_CAMERA:
                setIsVisible(true);
                return;
            case RoomWidgetCameraEvent.HIDE_CAMERA:
                setIsVisible(false);
                return;   
            case RoomWidgetCameraEvent.TOGGLE_CAMERA:
                setIsVisible(value => !value);
                return;
        }
    }, []);

    useUiEvent(RoomWidgetCameraEvent.SHOW_CAMERA, onRoomWidgetCameraEvent);
    useUiEvent(RoomWidgetCameraEvent.HIDE_CAMERA, onRoomWidgetCameraEvent);
    useUiEvent(RoomWidgetCameraEvent.TOGGLE_CAMERA, onRoomWidgetCameraEvent);

    const processAction = useCallback((type: string, value: string = null) =>
    {
        switch(type)
        {
            case 'close':
                setIsVisible(false);
                return;
        }
    }, []);

    const takePicture = useCallback(() =>
    {
        const frameBounds = cameraFrameRef.current.getBoundingClientRect();

        if(!frameBounds) return;

        const rectangle = new NitroRectangle(Math.floor(frameBounds.x), Math.floor(frameBounds.y), Math.floor(frameBounds.width), Math.floor(frameBounds.height));

        console.log(rectangle);

        GetRoomEngine().createRoomScreenshot(GetRoomSession().roomId, 1, rectangle);
    }, []);
    
    if(!isVisible) return null;

    return (
        <DraggableWindow handle=".nitro-camera">
            <div className="nitro-camera">
                <div className="overflow-auto">
                    <div className="cursor-pointer float-end me-3 mt-2" onClick={ event => processAction('close') }>
                        <i className="fas fa-times"></i>
                    </div>
                </div>
                <div className="d-flex justify-content-center">
                    <div ref={ cameraFrameRef } className="camera-frame"></div>
                    <div className="camera-button" onClick={ takePicture }></div>
                </div>
            </div>
        </DraggableWindow>
    );
}
