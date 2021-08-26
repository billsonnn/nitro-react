import { FC, useCallback } from 'react';
import { UserProfileIconViewProps } from './UserProfileIconView.types';

export const UserProfileIconView: FC<UserProfileIconViewProps> = props =>
{
    const { userId = -1, userName = null } = props;

    const visitProfile = useCallback(() =>
    {

    }, [ userId, userName ]);

    return (
        <i className="icon icon-user-profile me-1 cursor-pointer" onClick={ visitProfile } />
    );
}
