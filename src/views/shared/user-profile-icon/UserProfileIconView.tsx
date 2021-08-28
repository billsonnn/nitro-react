import { UserProfileComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback } from 'react';
import { SendMessageHook } from '../../../hooks';
import { UserProfileIconViewProps } from './UserProfileIconView.types';

export const UserProfileIconView: FC<UserProfileIconViewProps> = props =>
{
    const { userId = 0, userName = null } = props;

    const visitProfile = useCallback(() =>
    {
        if(userId) SendMessageHook(new UserProfileComposer(userId));
    }, [ userId ]);

    return (<>
        <i className="icon icon-user-profile me-1 cursor-pointer" onClick={ visitProfile } />
    </>);
}
