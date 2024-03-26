import { AvatarScaleType, AvatarSetType, GetAvatarRenderManager } from '@nitrots/nitro-renderer';
import { CSSProperties, FC, useEffect, useMemo, useRef, useState } from 'react';
import { Base, BaseProps } from '../Base';

export interface LayoutAvatarImageViewProps extends BaseProps<HTMLDivElement>
{
    figure: string;
    gender?: string;
    headOnly?: boolean;
    direction?: number;
    scale?: number;
}

export const LayoutAvatarImageView: FC<LayoutAvatarImageViewProps> = props =>
{
    const { figure = '', gender = 'M', headOnly = false, direction = 0, scale = 1, classNames = [], style = {}, ...rest } = props;
    const [ avatarUrl, setAvatarUrl ] = useState<string>(null);
    const [ isReady, setIsReady ] = useState<boolean>(false);
    const isDisposed = useRef(false);

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'avatar-image' ];

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ classNames ]);

    const getStyle = useMemo(() =>
    {
        let newStyle: CSSProperties = {};

        if(avatarUrl && avatarUrl.length) newStyle.backgroundImage = `url('${ avatarUrl }')`;

        if(scale !== 1)
        {
            newStyle.transform = `scale(${ scale })`;

            if(!(scale % 1)) newStyle.imageRendering = 'pixelated';
        }

        if(Object.keys(style).length) newStyle = { ...newStyle, ...style };

        return newStyle;
    }, [ avatarUrl, scale, style ]);

    useEffect(() =>
    {
        if(!isReady) return;

        const resetFigure = (_figure: string) =>
        {
            if(isDisposed.current) return;
            
            const avatarImage = GetAvatarRenderManager().createAvatarImage(_figure, AvatarScaleType.LARGE, gender, { resetFigure: (figure: string) => resetFigure(figure), dispose: null, disposed: false });

            let setType = AvatarSetType.FULL;

            if(headOnly) setType = AvatarSetType.HEAD;

            avatarImage.setDirection(setType, direction);

            const loadImage = async () =>
            {
                const imageUrl = await avatarImage.getCroppedImageUrl(setType);

                if(imageUrl && !isDisposed.current) setAvatarUrl(imageUrl);

                avatarImage.dispose();
            }

            loadImage();
        }

        resetFigure(figure);
    }, [ figure, gender, direction, headOnly, isReady ]);

    useEffect(() =>
    {
        isDisposed.current = false;
        
        setIsReady(true);

        return () =>
        {
            isDisposed.current = true;
        }
    }, []);
        
    return <Base classNames={ getClassNames } style={ getStyle } { ...rest } />;
}
