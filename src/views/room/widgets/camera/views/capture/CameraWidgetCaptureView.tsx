import classNames from 'classnames';
import { NitroRectangle } from 'nitro-renderer';
import { FC, useCallback, useRef } from 'react';
import { GetRoomEngine } from '../../../../../../api/nitro/room/GetRoomEngine';
import { GetRoomSession } from '../../../../../../api/nitro/session/GetRoomSession';
import { DraggableWindow } from '../../../../../../hooks/draggable-window/DraggableWindow';
import { LocalizeText } from '../../../../../../utils/LocalizeText';
import { useCameraWidgetContext } from '../../context/CameraWidgetContext';
import { CameraWidgetCaptureViewProps } from './CameraWidgetCaptureView.types';

export const CameraWidgetCaptureView: FC<CameraWidgetCaptureViewProps> = props =>
{
    const { onCloseClick = null, onEditClick = null } = props;

    const CAMERA_ROLL_LIMIT: number = 5;
    const cameraFrameRef = useRef<HTMLDivElement>();

    const cameraWidgetContext = useCameraWidgetContext();

    const takePicture = useCallback(() =>
    {
        if(cameraWidgetContext.selectedPictureIndex > -1)
        {
            cameraWidgetContext.setSelectedPictureIndex(-1);
            return;
        }
        
        const frameBounds = cameraFrameRef.current.getBoundingClientRect();

        if(!frameBounds) return;

        const rectangle = new NitroRectangle(Math.floor(frameBounds.x), Math.floor(frameBounds.y), Math.floor(frameBounds.width), Math.floor(frameBounds.height));

        const image = GetRoomEngine().createRoomScreenshot(GetRoomSession().roomId, 1, rectangle);

        if(cameraWidgetContext.cameraRoll.length + 1 === CAMERA_ROLL_LIMIT)
        {
            alert(LocalizeText('camera.full.body'));
        }

        let remainingRoll = cameraWidgetContext.cameraRoll;

        if(cameraWidgetContext.cameraRoll.length === CAMERA_ROLL_LIMIT)
        {
            remainingRoll = remainingRoll.slice(0, CAMERA_ROLL_LIMIT - 1);
        }

        cameraWidgetContext.setCameraRoll([ ...remainingRoll, image ]);
    }, [ cameraWidgetContext.cameraRoll, cameraWidgetContext.selectedPictureIndex ]);

    const processAction = useCallback((type: string, value: string | number = null) =>
    {
        switch(type)
        {
            case 'take_picture':
                takePicture();
                return;
            case 'preview_picture':
                cameraWidgetContext.setSelectedPictureIndex(Number(value));
                return;
            case 'discard_picture':
                cameraWidgetContext.setSelectedPictureIndex(-1);

                const clone = Array.from(cameraWidgetContext.cameraRoll);
                clone.splice(cameraWidgetContext.selectedPictureIndex, 1);
                
                cameraWidgetContext.setCameraRoll(clone);
                return;
            case 'edit_picture':
                onEditClick();
                return;
            case 'close':
                onCloseClick();
                return;
        }
    }, [ cameraWidgetContext.selectedPictureIndex, cameraWidgetContext.cameraRoll, onEditClick, onCloseClick ]);

    return (
        <DraggableWindow handle=".nitro-camera-capture">
            <div className="nitro-camera-capture d-flex flex-column justify-content-center align-items-center">
               <div className="camera-canvas">
                    <div className="position-absolute header-close" onClick={ event => processAction('close') }>
                        <i className="fas fa-times"/>
                    </div>
                    <div ref={ cameraFrameRef } className={'camera-frame ' + classNames({'bg': cameraWidgetContext.selectedPictureIndex > -1}) }>
                        { cameraWidgetContext.selectedPictureIndex > -1 && <div>
                            <img src={ cameraWidgetContext.cameraRoll[cameraWidgetContext.selectedPictureIndex].src } />
                            <div className="camera-frame-preview-actions w-100 position-absolute bottom-0 py-2 text-center">
                                <button className="btn btn-success me-3" title={ LocalizeText('camera.editor.button.tooltip') } onClick={ event => processAction('edit_picture') }>{ LocalizeText('camera.editor.button.text') }</button>
                                <button className="btn btn-danger" onClick={ event => processAction('discard_picture') }>{ LocalizeText('camera.delete.button.text') }</button>
                            </div>
                        </div> }
                    </div>
                    <div className="d-flex justify-content-center">
                        <div className="camera-button" title={ LocalizeText('camera.take.photo.button.tooltip') } onClick={ takePicture }></div>
                    </div>
               </div>
               { cameraWidgetContext.cameraRoll.length > 0 && <div className="camera-roll d-flex justify-content-center py-2">
                    { cameraWidgetContext.cameraRoll.map((picture, index) =>
                        {
                            return <img key={ index } className={ (index < cameraWidgetContext.cameraRoll.length - 1 ? 'me-2' : '') } src={ picture.src } onClick={ event => processAction('preview_picture', index) } />;
                        }) }
               </div> }
            </div>
        </DraggableWindow>
    );
}
