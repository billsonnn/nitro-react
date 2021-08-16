import { AvatarScaleType, AvatarSetType } from '@nitrots/nitro-renderer';
import { FC, useEffect, useRef, useState } from 'react';
import { GetAvatarRenderManager } from '../../../api';
import { AvatarImageViewProps } from './AvatarImageView.types';

export const AvatarImageView: FC<AvatarImageViewProps> = props =>
{
    const { figure = '', gender = 'M', headOnly = false, direction = 0, scale = 1 } = props;
    const [ avatarUrl, setAvatarUrl ] = useState<string>(null);
    const [ randomValue, setRandomValue ] = useState(-1);
    const isDisposed = useRef(false);

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

    const url = `url('${ avatarUrl }')`;
        
    return <div className={ 'avatar-image scale-' + scale } style={ (avatarUrl && url.length) ? { backgroundImage: url } : {} }></div>;
}
