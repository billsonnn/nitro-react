import { GetSessionDataManager, ReportType } from 'api';
import { FC } from 'react';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../common';
import { useFurnitureExternalImageWidget, useHelp, useNavigator } from '../../../../hooks';
import { CameraWidgetShowPhotoView } from '../../../camera/views/CameraWidgetShowPhotoView';

export const FurnitureExternalImageView: FC<{}> = props =>
{
    const { objectId = -1, currentPhotoIndex = -1, currentPhotos = null, onClose = null } = useFurnitureExternalImageWidget();
    const { navigatorData = null } = useNavigator();
    const { report = null } = useHelp();

    if((objectId === -1) || (currentPhotoIndex === -1)) return null;

    return (
        <NitroCardView className="nitro-external-image-widget" theme="primary-slim">
            <NitroCardHeaderView headerText="" isGalleryPhoto={ true } onReportPhoto={ () => report(ReportType.PHOTO, { reportedUserId: GetSessionDataManager().userId, roomId: navigatorData.enteredGuestRoom.roomId, roomName: navigatorData.enteredGuestRoom.roomName }) } onCloseClick={ onClose } />
            <NitroCardContentView>
                <CameraWidgetShowPhotoView currentIndex={ currentPhotoIndex } currentPhotos={ currentPhotos } />
            </NitroCardContentView>
        </NitroCardView>
    );
}
