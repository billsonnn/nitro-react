import { GetRoomEngine, TextureUtils, Vector3d } from '@nitrots/nitro-renderer';
import { CSSProperties, FC, useEffect, useMemo, useState } from 'react';
import { Base, BaseProps } from '../Base';

interface LayoutRoomObjectImageViewProps extends BaseProps<HTMLDivElement>
{
    roomId: number;
    objectId: number;
    category: number;
    direction?: number;
    scale?: number;
}

export const LayoutRoomObjectImageView: FC<LayoutRoomObjectImageViewProps> = props =>
{
    const { roomId = -1, objectId = 1, category = -1, direction = 2, scale = 1, style = {}, ...rest } = props;
    const [ imageElement, setImageElement ] = useState<HTMLImageElement>(null);

    const getStyle = useMemo(() =>
    {
        let newStyle: CSSProperties = {};

        if(imageElement?.src?.length)
        {
            newStyle.backgroundImage = `url('${ imageElement.src }')`;
            newStyle.width = imageElement.width;
            newStyle.height = imageElement.height;
        }

        if(scale !== 1)
        {
            newStyle.transform = `scale(${ scale })`;

            if(!(scale % 1)) newStyle.imageRendering = 'pixelated';
        }

        if(Object.keys(style).length) newStyle = { ...newStyle, ...style };

        return newStyle;
    }, [ imageElement, scale, style ]);

    useEffect(() =>
    {
        const imageResult = GetRoomEngine().getRoomObjectImage(roomId, objectId, category, new Vector3d(direction * 45), 64, {
            imageReady: async (id, texture, image) => setImageElement(await TextureUtils.generateImage(texture)),
            imageFailed: null
        });

        // needs (roomObjectImage.data.width > 140) || (roomObjectImage.data.height > 200) scale 1

        if(!imageResult) return;

        (async () => setImageElement(await TextureUtils.generateImage(imageResult.data)))();
    }, [ roomId, objectId, category, direction, scale ]);

    if(!imageElement) return null;

    return <Base classNames={ [ 'furni-image' ] } style={ getStyle } { ...rest } />;
}
