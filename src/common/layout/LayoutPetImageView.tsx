import { IPetCustomPart, PetFigureData, TextureUtils, Vector3d } from '@nitrots/nitro-renderer';
import { CSSProperties, FC, useEffect, useMemo, useRef, useState } from 'react';
import { GetRoomEngine } from '../../api';
import { Base, BaseProps } from '../Base';

interface LayoutPetImageViewProps extends BaseProps<HTMLDivElement>
{
    figure?: string;
    typeId?: number;
    paletteId?: number;
    petColor?: number;
    customParts?: IPetCustomPart[];
    posture?: string;
    headOnly?: boolean;
    direction?: number;
    scale?: number;
}

export const LayoutPetImageView: FC<LayoutPetImageViewProps> = props =>
{
    const { figure = '', typeId = -1, paletteId = -1, petColor = 0xFFFFFF, customParts = [], posture = 'std', headOnly = false, direction = 0, scale = 1, style = {}, ...rest } = props;
    const [ petUrl, setPetUrl ] = useState<string>(null);
    const [ width, setWidth ] = useState(0);
    const [ height, setHeight ] = useState(0);
    const isDisposed = useRef(false);

    const getStyle = useMemo(() =>
    {
        let newStyle: CSSProperties = {};

        if(petUrl && petUrl.length) newStyle.backgroundImage = `url(${ petUrl })`;

        if(scale !== 1)
        {
            newStyle.transform = `scale(${ scale })`;

            if(!(scale % 1)) newStyle.imageRendering = 'pixelated';
        }

        newStyle.width = width;
        newStyle.height = height;

        if(Object.keys(style).length) newStyle = { ...newStyle, ...style };

        return newStyle;
    }, [ petUrl, scale, style, width, height ]);

    useEffect(() =>
    {
        let url = null;

        let petTypeId = typeId;
        let petPaletteId = paletteId;
        let petColor1 = petColor;
        let petCustomParts: IPetCustomPart[] = customParts;
        let petHeadOnly = headOnly;

        if(figure && figure.length)
        {
            const petFigureData = new PetFigureData(figure);

            petTypeId = petFigureData.typeId;
            petPaletteId = petFigureData.paletteId;
            petColor1 = petFigureData.color;
            petCustomParts = petFigureData.customParts;
        }

        if(petTypeId === 16) petHeadOnly = false;

        const imageResult = GetRoomEngine().getRoomObjectPetImage(petTypeId, petPaletteId, petColor1, new Vector3d((direction * 45)), 64, {
            imageReady: (id, texture, image) =>
            {
                if(isDisposed.current) return;

                if(image)
                {
                    setPetUrl(image.src);
                    setWidth(image.width);
                    setHeight(image.height);
                }

                else if(texture)
                {
                    setPetUrl(TextureUtils.generateImageUrl(texture));
                    setWidth(texture.width);
                    setHeight(texture.height);
                }
            },
            imageFailed: (id) =>
            {

            }
        }, petHeadOnly, 0, petCustomParts, posture);

        if(imageResult)
        {
            const image = imageResult.getImage();

            if(image)
            {
                setPetUrl(image.src);
                setWidth(image.width);
                setHeight(image.height);
            }
        }
    }, [ figure, typeId, paletteId, petColor, customParts, posture, headOnly, direction ]);

    useEffect(() =>
    {
        isDisposed.current = false;

        return () =>
        {
            isDisposed.current = true;
        }
    }, []);

    const url = `url('${ petUrl }')`;

    return <Base classNames={ [ 'pet-image' ] } style={ getStyle } { ...rest } />;
}
