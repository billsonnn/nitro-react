import { PetFigureData, TextureUtils, Vector3d } from 'nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { GetRoomEngine } from '../../api';
import { PetImageViewProps } from './PetImageView.types';

export const PetImageView: FC<PetImageViewProps> = props =>
{
    const { figure = '', headOnly = false, direction = 0, scale = 1 } = props;

    const [ petUrl, setPetUrl ] = useState<string>(null);

    const getPetImageUrl = useCallback(() =>
    {
        let url = null;

        const petFigureData = new PetFigureData(figure);

        const imageResult = GetRoomEngine().getRoomObjectPetImage(petFigureData.typeId, petFigureData.paletteId, petFigureData.color, new Vector3d((direction * 45)), 64, {
            imageReady: (id, texture, image) =>
            {
                if(image) setPetUrl(image.src);
                else if(texture) setPetUrl(TextureUtils.generateImageUrl(texture));
            },
            imageFailed: (id) =>
            {

            }
        }, headOnly, 0, petFigureData.customParts, 'std');

        if(imageResult)
        {
            const image = imageResult.getImage();

            if(image) url = image.src;
        }

        return url;
    }, [ figure, headOnly, direction ]);

    useEffect(() =>
    {
        setPetUrl(getPetImageUrl());
    }, [ getPetImageUrl ]);

    const url = `url('${ petUrl }')`;
        
    return <div className={ 'pet-image scale-' + scale } style={ (petUrl && url.length) ? { backgroundImage: url } : {} }></div>;
}
