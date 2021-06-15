import classNames from 'classnames';
import { NitroRectangle } from 'nitro-renderer';
import { FC, useCallback, useRef, useState } from 'react';
import { GetRoomEngine } from '../../../../../../api/nitro/room/GetRoomEngine';
import { GetRoomSession } from '../../../../../../api/nitro/session/GetRoomSession';
import { DraggableWindow } from '../../../../../../hooks/draggable-window/DraggableWindow';
import { LocalizeText } from '../../../../../../utils/LocalizeText';
import { CameraWidgetCaptureViewProps } from './CameraWidgetCaptureView.types';

export const CameraWidgetCaptureView: FC<CameraWidgetCaptureViewProps> = props =>
{
    const CAMERA_ROLL_LIMIT: number = 5;

    const [ picturesTaken, setPicturesTaken ]               = useState<HTMLImageElement[]>([]);
    const [ selectedPictureIndex, setSelectedPictureIndex ] = useState(-1);
    const cameraFrameRef                                    = useRef<HTMLDivElement>();

    const takePicture = useCallback(() =>
    {
        if(selectedPictureIndex > -1)
        {
            setSelectedPictureIndex(-1);
            return;
        }
        
        const frameBounds = cameraFrameRef.current.getBoundingClientRect();

        if(!frameBounds) return;

        const rectangle = new NitroRectangle(Math.floor(frameBounds.x), Math.floor(frameBounds.y), Math.floor(frameBounds.width), Math.floor(frameBounds.height));

        const image = GetRoomEngine().createRoomScreenshot(GetRoomSession().roomId, 1, rectangle);

        if(picturesTaken.length + 1 === CAMERA_ROLL_LIMIT)
        {
            alert(LocalizeText('camera.full.body'));
        }

        if(picturesTaken.length === CAMERA_ROLL_LIMIT)
        {
            setPicturesTaken(picturesTaken => [ ...picturesTaken.slice(0, CAMERA_ROLL_LIMIT - 1), image ]);
        }
        else
        {
            setPicturesTaken(picturesTaken => [ ...picturesTaken, image ]);
        }
    }, [ picturesTaken, selectedPictureIndex ]);

    const processAction = useCallback((type: string, value: string | number = null) =>
    {
        switch(type)
        {
            case 'take_picture':
                takePicture();
                return;
            case 'preview_picture':
                setSelectedPictureIndex(Number(value));
                return;
            case 'discard_picture':
                setSelectedPictureIndex(-1);
                const newPicturesTaken = picturesTaken;
                picturesTaken.splice(selectedPictureIndex, 1);
                setPicturesTaken(newPicturesTaken);
                return;
            case 'edit_picture':
                props.onChoosePicture(picturesTaken[selectedPictureIndex]);
                return;
        }
    }, [ picturesTaken, selectedPictureIndex ]);

    return (
        <DraggableWindow handle=".nitro-camera-capture">
            <div className="nitro-camera-capture d-flex flex-column justify-content-center align-items-center">
               <div className="camera-canvas">
                    <div className="overflow-auto">
                        <div className="cursor-pointer float-end me-3 mt-2" onClick={ props.onCloseClick }>
                            <i className="fas fa-times"></i>
                        </div>
                    </div>
                    <div ref={ cameraFrameRef } className={'camera-frame ' + classNames({'bg': selectedPictureIndex > -1}) }>
                        { selectedPictureIndex > -1 && <div>
                            <img src={ picturesTaken[selectedPictureIndex].src } />
                            <div className="camera-frame-preview-actions w-100 position-absolute bottom-0 py-2 text-center">
                                <button className="btn btn-success me-3" onClick={ event => processAction('edit_picture') }>{ LocalizeText('camera.editor.button.text') }</button>
                                <button className="btn btn-danger" onClick={ event => processAction('discard_picture') }>{ LocalizeText('camera.delete.button.text') }</button>
                            </div>
                        </div> }
                    </div>
                    <div className="d-flex justify-content-center">
                        <div className="camera-button" onClick={ takePicture }></div>
                    </div>
               </div>
               { picturesTaken.length > 0 && <div className="camera-roll d-flex justify-content-center py-2">
                    { picturesTaken.map((picture, index) =>
                        {
                            return <img key={ index } className={ (index < picturesTaken.length - 1 ? 'me-2' : '') } src={ picture.src } onClick={ event => processAction('preview_picture', index) } />;
                        }) }
               </div> }
            </div>
        </DraggableWindow>
    );
}
