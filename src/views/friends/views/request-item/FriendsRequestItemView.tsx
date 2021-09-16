import { AcceptFriendMessageComposer, DeclineFriendMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback } from 'react';
import { SendMessageHook } from '../../../../hooks/messages/message-event';
import { UserProfileIconView } from '../../../shared/user-profile-icon/UserProfileIconView';
import { FriendsRequestItemViewProps } from './FriendsRequestItemView.types';

export const FriendsRequestItemView: FC<FriendsRequestItemViewProps> = props =>
{
    const { request = null } = props;

    const accept = useCallback(() =>
    {
        if(!request) return;
        
        SendMessageHook(new AcceptFriendMessageComposer(request.id));
    }, [ request ]);

    const decline = useCallback(() =>
    {
        if(!request) return;
        
        SendMessageHook(new DeclineFriendMessageComposer(false, request.id));
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
