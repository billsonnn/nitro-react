import { AcceptFriendComposer, DeclineFriendComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback } from 'react';
import { SendMessageHook } from '../../../../hooks/messages/message-event';
import { UserProfileIconView } from '../../../shared/user-profile-icon/UserProfileIconView';
import { FriendListRequestsItemViewProps } from './FriendListRequestsItemView.types';

export const FriendListRequestsItemView: FC<FriendListRequestsItemViewProps> = props =>
{
    const { request = null } = props;

    const accept = useCallback(() =>
    {
        if(!request) return;
        
        SendMessageHook(new AcceptFriendComposer(request.id));
    }, [ request ]);

    const decline = useCallback(() =>
    {
        if(!request) return;
        
        SendMessageHook(new DeclineFriendComposer(false, request.id));
    }, [ request ]);

    if(!request) return null;

    return (
        <div className="px-2 py-1 d-flex gap-1 align-items-center">
            <UserProfileIconView userId={ request.id } />
            <div>{ request.name }</div>
            <div className="ms-auto d-flex align-items-center gap-1">
               <i className="icon icon-accept cursor-pointer" onClick={ accept } />
               <i className="icon icon-deny cursor-pointer" onClick={ decline } />
            </div>
        </div>
    );
};
