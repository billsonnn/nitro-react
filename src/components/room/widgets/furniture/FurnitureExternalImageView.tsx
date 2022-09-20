import { FC } from 'react';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../common';
import { useFurnitureExternalImageWidget } from '../../../../hooks';
import { CameraWidgetShowPhotoView } from '../../../camera/views/CameraWidgetShowPhotoView';

export const FurnitureExternalImageView: FC<{}> = props =>
{
    const { objectId = -1, photoData = [], photoCliked = null, onClose = null } = useFurnitureExternalImageWidget();

    if((objectId === -1) || !photoData) return null;

    return (
        <NitroCardView className="nitro-external-image-widget" theme="primary-slim">
            <NitroCardHeaderView headerText="" onCloseClick={ onClose } />
            <NitroCardContentView>
                { photoData.map((photoView, index) =>
                {
                    const isActive = photoView.w === photoCliked.w ? true : false;

                    return <CameraWidgetShowPhotoView key={ index } photo={ photoView } photos={ photoData } isActive={ isActive } />
                })
                }
            </NitroCardContentView>
        </NitroCardView>
    );
}
