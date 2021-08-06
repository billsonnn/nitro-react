import { IGetImageListener, ImageResult, TextureUtils, Vector3d } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { GetRoomEngine } from '../../../api';
import { ProductTypeEnum } from '../../catalog/common/ProductTypeEnum';
import { FurniImageViewProps } from './FurniImageView.types';

export const FurniImageView: FC<FurniImageViewProps> = props =>
{
    const { type = 's', spriteId = -1, direction = 0, extras = '', scale = 1 } = props;
    const [ imageElement, setImageElement ] = useState<HTMLImageElement>(null);

    const buildImage = useCallback(() =>
    {
        let imageResult: ImageResult = null;

        const furniType = type.toLocaleLowerCase();

        const listener: IGetImageListener = {
            imageReady: (id, texture, image) =>
            {
                if(!image && texture)
                {
                    image = TextureUtils.generateImage(texture);
                }

                image.onload = () => setImageElement(image);
            },
            imageFailed: null
        };

        switch(furniType)
        {
            case ProductTypeEnum.FLOOR:
                imageResult = GetRoomEngine().getFurnitureFloorImage(spriteId, new Vector3d(direction), 64, listener, 0, extras);
                break;
            case ProductTypeEnum.WALL:
                imageResult = GetRoomEngine().getFurnitureWallImage(spriteId, new Vector3d(direction), 64, listener, 0, extras);
                break;
        }

        if(imageResult)
        {
            const image = imageResult.getImage();

            image.onload = () => setImageElement(image);
        }
    }, [ type, spriteId, direction, extras ]);

    useEffect(() =>
    {
        buildImage();
    }, [ buildImage ]);

    if(!imageElement) return null;

    const imageUrl = `url('${ imageElement.src }')`;
        
    return <div className={ 'furni-image scale-' + scale } style={ { backgroundImage: imageUrl, width: imageElement.width, height: imageElement.height } }></div>;
}
