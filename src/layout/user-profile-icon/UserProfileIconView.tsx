import { FC, useMemo } from 'react';
import { GetUserProfile } from '../../api';
import { NitroLayoutBase } from '../base';
import { UserProfileIconViewProps } from './UserProfileIconView.types';

export const UserProfileIconView: FC<UserProfileIconViewProps> = props =>
{
    const { userId = 0, userName = null, className = '', children = null, ...rest  } = props;

    const getClassName = useMemo(() =>
    {
        let newClassName = 'nitro-friends-spritesheet icon-profile-sm me-1 cursor-pointer';

        if(className && className.length) newClassName += ` ${ className }`;

        return newClassName;
    }, [ className ]);

    return (
        <NitroLayoutBase className={ getClassName } onClick={ event => GetUserProfile(userId) } { ... rest }>
            { children }
        </NitroLayoutBase>
    );
}
