import { FC, useCallback, useState } from 'react';
import { RoomWidgetThumbnailEvent } from '../../../../events/room-widgets/thumbnail';
import { useUiEvent } from '../../../../hooks/events';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../layout';
import { LocalizeText } from '../../../../utils/LocalizeText';
import { RoomThumbnailWidgetBuilderView } from './views/builder/RoomThumbnailWidgetBuilderView';
import { RoomThumbnailWidgetCameraView } from './views/camera/RoomThumbnailWidgetCameraView';

export const RoomThumbnailWidgetView: FC<{}> = props =>
{
    const [ isSelectorVisible, setIsSelectorVisible ] = useState(false);
    const [ isBuilderVisible, setIsBuilderVisible ] = useState(false);
    const [ isCameraVisible, setIsCameraVisible ] = useState(false);

    const onNitroEvent = useCallback((event: RoomWidgetThumbnailEvent) =>
    {
        switch(event.type)
        {
            case RoomWidgetThumbnailEvent.SHOW_THUMBNAIL:
                setIsSelectorVisible(true);
                return;
            case RoomWidgetThumbnailEvent.HIDE_THUMBNAIL:
                setIsSelectorVisible(false);
                setIsBuilderVisible(false);
                setIsCameraVisible(false);
                return;   
            case RoomWidgetThumbnailEvent.TOGGLE_THUMBNAIL:
                setIsSelectorVisible(value => !value);
                setIsBuilderVisible(false);
                setIsCameraVisible(false);
                return;
        }
    }, []);

    useUiEvent(RoomWidgetThumbnailEvent.SHOW_THUMBNAIL, onNitroEvent);
    useUiEvent(RoomWidgetThumbnailEvent.HIDE_THUMBNAIL, onNitroEvent);
    useUiEvent(RoomWidgetThumbnailEvent.TOGGLE_THUMBNAIL, onNitroEvent);

    const handleAction = useCallback((action: string) =>
    {
        switch(action)
        {
            case 'camera':
                setIsSelectorVisible(false);
                setIsCameraVisible(true);
                return;
            case 'builder':
                setIsSelectorVisible(false);
                setIsBuilderVisible(true);
                return;
        }
    }, [ setIsSelectorVisible, setIsCameraVisible, setIsBuilderVisible ]);

    return (<>
        { isSelectorVisible && <NitroCardView className="nitro-room-thumbnail">
            <NitroCardHeaderView headerText={ LocalizeText('navigator.thumbeditor.caption') } onCloseClick={ () => setIsSelectorVisible(false) } />
            <NitroCardContentView className="d-flex align-items-center justify-content-center text-muted">
                <div className="option me-5" onClick={ () => handleAction('camera') }>
                    <i className="fas fa-camera" />
                </div>
                <div className="option" onClick={ () => handleAction('builder') }>
                    <i className="fas fa-pencil-ruler" />
                </div>
            </NitroCardContentView>
        </NitroCardView> }
        { isBuilderVisible && <RoomThumbnailWidgetBuilderView onCloseClick={ () => setIsBuilderVisible(false) } /> }
        { isCameraVisible && <RoomThumbnailWidgetCameraView onCloseClick={ () => setIsCameraVisible(false) } /> }
    </>);
};
