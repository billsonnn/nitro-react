import { FC } from 'react';
import { LocalizeText } from '../../../../api';
import { Flex, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../common';
import { useFurnitureExternalImageWidget } from '../../../../hooks';

export const FurnitureExternalImageView: FC<{}> = props =>
{
    const { objectId = -1, photoData = null, onClose = null } = useFurnitureExternalImageWidget();

    if((objectId === -1) || !photoData) return null;
    
    return (
        <NitroCardView className="nitro-external-image-widget" theme="primary-slim">
            <NitroCardHeaderView headerText="" onCloseClick={ onClose } />
            <NitroCardContentView>
                <Flex center className="picture-preview border border-black" style={ photoData.w ? { backgroundImage: 'url(' + photoData.w + ')' } : {} }>
                    { !photoData.w &&
                        <Text bold>{ LocalizeText('camera.loading') }</Text> }
                </Flex>
                { photoData.m && photoData.m.length &&
                    <Text center>{ photoData.m }</Text> }
                <Flex alignItems="center" justifyContent="between">
                    <Text>{ (photoData.n || '') }</Text>
                    <Text>{ new Date(photoData.t * 1000).toLocaleDateString() }</Text>
                </Flex>
            </NitroCardContentView>
        </NitroCardView>
    );
}
