import { IGetImageListener, ImageResult, TextureUtils, Vector3d } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { GetRoomEngine } from '../../../api';
import { Base } from '../../../common/Base';
import { ProductTypeEnum } from '../../../components/catalog/common/ProductTypeEnum';

interface FurniImageViewProps
{
    productType: string;
    productClassId: number;
    direction?: number;
    extraData?: string;
    scale?: number;
}

export const FurniImageView: FC<FurniImageViewProps> = props =>
{
    const { productType = 's', productClassId = -1, direction = 0, extraData = '', scale = 1 } = props;
    const [ imageElement, setImageElement ] = useState<HTMLImageElement>(null);

    const buildImage = useCallback(() =>
    {
        let imageResult: ImageResult = null;

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

        switch(productType.toLocaleLowerCase())
        {
            case ProductTypeEnum.FLOOR:
                imageResult = GetRoomEngine().getFurnitureFloorImage(productClassId, new Vector3d(direction), 64, listener, 0, extraData);
                break;
            case ProductTypeEnum.WALL:
                imageResult = GetRoomEngine().getFurnitureWallImage(productClassId, new Vector3d(direction), 64, listener, 0, extraData);
                break;
        }

        if(imageResult)
        {
            const image = imageResult.getImage();
            
            image.onload = () => setImageElement(image);
        }
    }, [ productType, productClassId, direction, extraData ]);

    useEffect(() =>
    {
        buildImage();
    }, [ buildImage ]);

    if(!imageElement) return null;

    const imageUrl = `url('${ imageElement.src }')`;

    return <Base classNames={ [ 'furni-image', `scale-${ scale }` ] } style={ { backgroundImage: imageUrl, width: imageElement.width, height: imageElement.height } } />;
}
