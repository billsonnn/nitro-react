import { FC } from 'react';
import { GetUserProfile } from '../../../api';
import { UserProfileIconViewProps } from './UserProfileIconView.types';

export const UserProfileIconView: FC<UserProfileIconViewProps> = props =>
{
    const { userId = 0, userName = null } = props;

    return (<>
        <i className="icon icon-user-profile me-1 cursor-pointer" onClick={ () => GetUserProfile(userId) } />
    </>);
}
