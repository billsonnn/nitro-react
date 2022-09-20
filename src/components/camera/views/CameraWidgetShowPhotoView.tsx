import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, useEffect, useState } from 'react';
import { GetUserProfile, IPhotoData, LocalizeText } from '../../../api';
import { Flex, Grid, Text } from '../../../common';

export interface CameraWidgetShowPhotoViewProps
{
    photo: any;
    photos: any;
    isActive: boolean;
}

export const CameraWidgetShowPhotoView: FC<CameraWidgetShowPhotoViewProps> = props =>
{
    const { photo = null, photos = null, isActive = false } = props;
    const [ photoImg, setPhotoImg ] = useState<IPhotoData>(photo); // photo is default value when clicked the photo
    const [ imgIndex, setImgIndex ] = useState(0);

    if(!photo) return null;

    const next = () =>
    {
        let newImgCount = 0;

        if (imgIndex >= photos.length) setImgIndex(0);

        setImgIndex(prevValue =>
        {
            newImgCount = (prevValue + 1);

            return newImgCount;
        });

        setPhotoImg(photos[imgIndex]);
    }

    const previous = () =>
    {
        let newImgCount = 0;

        if (imgIndex <= 0) setImgIndex(photos.length);

        setImgIndex(prevValue =>
        {
            newImgCount = (prevValue - 1);

            return newImgCount;
        });

        setPhotoImg(photos[imgIndex]);
    }

    const openProfile = (ownerId: number) =>
    {
        GetUserProfile(ownerId);
    }

    useEffect(() =>
    {
        setPhotoImg(photoImg);

        if (imgIndex >= photos.length) setImgIndex(0);
        if (imgIndex < 0) setImgIndex(photos.length);

    }, [ photoImg ]);

    return (
        (isActive) &&
        <Grid style={ { display: 'flex', flexDirection: 'column' } }>
            <Flex center className="picture-preview border border-black" style={ photoImg.w ? { backgroundImage: 'url(' + photoImg.w + ')' } : {} }>
                { !photoImg.w &&
                    <Text bold>{ LocalizeText('camera.loading') }</Text> }
            </Flex>
            { photoImg.m && photoImg.m.length &&
                <Text center>{ photoImg.m }</Text> }
            <Flex alignItems="center" justifyContent="between">
                <Text>{ (photoImg.n || '') }</Text>
                <Text>{ new Date(photoImg.t * 1000).toLocaleDateString() }</Text>
            </Flex>
            { (photos.length > 1) &&
                <Flex className="picture-preview-buttons">
                    <FontAwesomeIcon icon="arrow-left" className="cursor-pointer picture-preview-buttons-previous" onClick={ event => previous() } />
                    <Text underline className="cursor-pointer" onClick={ event => openProfile(photoImg.oi) }>{ photoImg.o }</Text>
                    <FontAwesomeIcon icon="arrow-right" className="cursor-pointer picture-preview-buttons-next" onClick={ event => next() } />
                </Flex>
            }
        </Grid>
    );
}
