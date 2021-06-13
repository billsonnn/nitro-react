import { FC, useCallback, useState } from 'react';
import { RoomWidgetCameraEvent } from '../../../../events/room-widgets/camera/RoomWidgetCameraEvent';
import { DraggableWindow } from '../../../../hooks/draggable-window/DraggableWindow';
import { useUiEvent } from '../../../../hooks/events/ui/ui-event';
import { CameraWidgetViewProps } from './CameraWidgetView.types';

export const CameraWidgetView: FC<CameraWidgetViewProps> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);

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
                    <div className="camera-button"></div>
                </div>
            </div>
        </DraggableWindow>
    );
}
