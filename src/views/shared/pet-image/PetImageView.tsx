import { PetFigureData, TextureUtils, Vector3d } from '@nitrots/nitro-renderer';
import { FC, useEffect, useRef, useState } from 'react';
import { GetRoomEngine } from '../../../api';
import { PetImageViewProps } from './PetImageView.types';

export const PetImageView: FC<PetImageViewProps> = props =>
{
    const { figure = '', typeId = -1, paletteId = -1, color = 0xFFFFFF, customParts = [], posture = 'std', headOnly = false, direction = 0, scale = 1 } = props;
    const [ petUrl, setPetUrl ] = useState<string>(null);
    const isDisposed = useRef(false);

    useEffect(() =>
    {
        let url = null;

        let petTypeId = typeId;
        let petPaletteId = paletteId;
        let petColor = color;
        let petCustomParts = customParts;
        let petHeadOnly = headOnly;

        if(figure && figure.length)
        {
            const petFigureData = new PetFigureData(figure);

            petTypeId = petFigureData.typeId;
            petPaletteId = petFigureData.paletteId;
            petColor = petFigureData.color;
            petCustomParts = petFigureData.customParts;
        }

        if(petTypeId === 16) petHeadOnly = false;

        const imageResult = GetRoomEngine().getRoomObjectPetImage(petTypeId, petPaletteId, petColor, new Vector3d((direction * 45)), 64, {
            imageReady: (id, texture, image) =>
            {
                if(isDisposed.current) return;

                if(image) setPetUrl(image.src);
                else if(texture) setPetUrl(TextureUtils.generateImageUrl(texture));
            },
            imageFailed: (id) =>
            {

            }
        }, petHeadOnly, 0, petCustomParts, posture);

        if(imageResult)
        {
            const image = imageResult.getImage();

            if(image) setPetUrl(image.src);


        }
    }, [ figure, typeId, paletteId, color, customParts, posture, headOnly, direction ]);

    useEffect(() =>
    {
        isDisposed.current = false;

        return () =>
        {
            isDisposed.current = true;
        }
    }, []);

    const url = `url('${ petUrl }')`;
        
    return <div className={ 'pet-image scale-' + scale.toString().replace('.', '-') } style={ (petUrl && url.length) ? { backgroundImage: url } : {} }></div>;
}
