import { AvatarScaleType, AvatarSetType } from 'nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { GetAvatarRenderManager } from '../../../api';
import { AvatarImageViewProps } from './AvatarImageView.types';

export const AvatarImageView: FC<AvatarImageViewProps> = props =>
{
    const { figure = '', gender = 'M', headOnly = false, direction = 0, scale = 1 } = props;

    const [ avatarUrl, setAvatarUrl ] = useState<string>(null);

    const getUserImageUrl = useCallback(() =>
    {
        let url = null;

        const avatarImage = GetAvatarRenderManager().createAvatarImage(figure, AvatarScaleType.LARGE, gender, {
            resetFigure: (figure) => setAvatarUrl(getUserImageUrl()),
            dispose: () => {},
            disposed: false
        }, null);

        if(avatarImage)
        {
            let setType = AvatarSetType.FULL;

            if(headOnly) setType = AvatarSetType.HEAD;

            avatarImage.setDirection(setType, direction);

            const image = avatarImage.getCroppedImage(setType);

            if(image) url = image.src;

            avatarImage.dispose();
        }

        return url;
    }, [ figure, gender, direction, headOnly ]);

    useEffect(() =>
    {
        setAvatarUrl(getUserImageUrl());
    }, [ getUserImageUrl ]);

    const url = `url('${ avatarUrl }')`;
        
    return <div className={ 'avatar-image scale-' + scale } style={ (avatarUrl && url.length) ? { backgroundImage: url } : {} }></div>;
}
