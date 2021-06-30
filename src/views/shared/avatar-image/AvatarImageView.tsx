import { AvatarScaleType, AvatarSetType } from 'nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { GetAvatarRenderManager } from '../../../api';
import { AvatarImageViewProps } from './AvatarImageView.types';

export const AvatarImageView: FC<AvatarImageViewProps> = props =>
{
    const { figure = '', gender = 'M', headOnly = false, direction = 0, scale = 1 } = props;

    const [ avatarUrl, setAvatarUrl ] = useState<string>(null);
    const [ randomValue, setRandomValue ] = useState(-1);

    useEffect(() =>
    {
        if(randomValue) {}

        const avatarImage = GetAvatarRenderManager().createAvatarImage(figure, AvatarScaleType.LARGE, gender, {
            resetFigure: figure => setRandomValue(Math.random()),
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

    const url = `url('${ avatarUrl }')`;
        
    return <div className={ 'avatar-image scale-' + scale } style={ (avatarUrl && url.length) ? { backgroundImage: url } : {} }></div>;
}
