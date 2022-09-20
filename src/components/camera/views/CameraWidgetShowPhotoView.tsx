import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, useEffect, useState } from 'react';
import { GetUserProfile, IPhotoData, LocalizeText } from '../../../api';
import { Flex, Grid, Text } from '../../../common';

export interface CameraWidgetShowPhotoViewProps
{
    currentIndex: number;
    currentPhotos: IPhotoData[];
}

export const CameraWidgetShowPhotoView: FC<CameraWidgetShowPhotoViewProps> = props =>
{
    const { currentIndex = -1, currentPhotos = null } = props;
    const [ imageIndex, setImageIndex ] = useState(0);

    const currentImage = (currentPhotos && currentPhotos.length) ? currentPhotos[imageIndex] : null;

    const next = () =>
    {
        setImageIndex(prevValue =>
        {
            let newIndex = (prevValue + 1);

            if(newIndex >= currentPhotos.length) newIndex = 0;

            return newIndex;
        });
    }

    const previous = () =>
    {
        setImageIndex(prevValue =>
        {
            let newIndex = (prevValue - 1);

            if(newIndex < 0) newIndex = (currentPhotos.length - 1);

            return newIndex;
        });
    }

    useEffect(() =>
    {
        setImageIndex(currentIndex);
    }, [ currentIndex ]);

    if(!currentImage) return null;

    return (
        <Grid style={ { display: 'flex', flexDirection: 'column' } }>
            <Flex center className="picture-preview border border-black" style={ currentImage.w ? { backgroundImage: 'url(' + currentImage.w + ')' } : {} }>
                { !currentImage.w &&
                    <Text bold>{ LocalizeText('camera.loading') }</Text> }
            </Flex>
            { currentImage.m && currentImage.m.length &&
                <Text center>{ currentImage.m }</Text> }
            <Flex alignItems="center" justifyContent="between">
                <Text>{ (currentImage.n || '') }</Text>
                <Text>{ new Date(currentImage.t * 1000).toLocaleDateString() }</Text>
            </Flex>
            { (currentPhotos.length > 1) &&
                <Flex className="picture-preview-buttons">
                    <FontAwesomeIcon icon="arrow-left" className="cursor-pointer picture-preview-buttons-previous" onClick={ previous } />
                    <Text underline className="cursor-pointer" onClick={ event => GetUserProfile(currentImage.oi) }>{ currentImage.o }</Text>
                    <FontAwesomeIcon icon="arrow-right" className="cursor-pointer picture-preview-buttons-next" onClick={ next } />
                </Flex>
            }
        </Grid>
    );
}
