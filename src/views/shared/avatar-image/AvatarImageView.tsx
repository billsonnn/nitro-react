import { AvatarScaleType, AvatarSetType } from '@nitrots/nitro-renderer';
import { CSSProperties, FC, useEffect, useMemo, useRef, useState } from 'react';
import { GetAvatarRenderManager } from '../../../api';
import { Base, BaseProps } from '../../../common/Base';

export interface AvatarImageViewProps extends BaseProps<HTMLDivElement>
{
    figure: string;
    gender?: string;
    headOnly?: boolean;
    direction?: number;
    scale?: number;
}

export const AvatarImageView: FC<AvatarImageViewProps> = props =>
{
    const { figure = '', gender = 'M', headOnly = false, direction = 0, scale = 1, classNames = [], style = {}, ...rest } = props;
    const [ avatarUrl, setAvatarUrl ] = useState<string>(null);
    const [ randomValue, setRandomValue ] = useState(-1);
    const isDisposed = useRef(false);

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'avatar-image' ];

        switch(scale)
        {
            case .5:
                newClassNames.push('scale-0-5');
                break;
            case .75:
                newClassNames.push('scale-0-75');
                break;
            case 1.25:
                newClassNames.push('scale-1-25');
                break;
            case 1.50:
                newClassNames.push('scale-1-50');
                break;
            default:
                newClassNames.push(`scale-${ scale }`);
                break;
        }

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ scale, classNames ]);

    const getStyle = useMemo(() =>
    {
        let newStyle: CSSProperties = {};

        if(avatarUrl && avatarUrl.length) newStyle.backgroundImage = `url('${ avatarUrl }')`;

        if(Object.keys(style).length) newStyle = { ...newStyle, ...style };

        return newStyle;
    }, [ avatarUrl, style ]);

    useEffect(() =>
    {
        const avatarImage = GetAvatarRenderManager().createAvatarImage(figure, AvatarScaleType.LARGE, gender, {
            resetFigure: figure => 
            {
                if(isDisposed.current) return;

                setRandomValue(Math.random());
            },
            dispose: () => {},
            disposed: false
        }, null);

        if(!avatarImage) return;
        
        let setType = AvatarSetType.FULL;

        if(headOnly) setType = AvatarSetType.HEAD;

        avatarImage.setDirection(setType, direction);

        const image = avatarImage.getCroppedImage(setType);

        if(image) setAvatarUrl(image.src);

        avatarImage.dispose();
    }, [ figure, gender, direction, headOnly, randomValue ]);

    useEffect(() =>
    {
        isDisposed.current = false;

        return () =>
        {
            isDisposed.current = true;
        }
    }, []);
        
    return <Base classNames={ getClassNames } style={ getStyle } { ...rest } />;
}
