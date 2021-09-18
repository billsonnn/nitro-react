import { FollowFriendMessageComposer, SetRelationshipStatusComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { LocalizeText, OpenMessengerChat } from '../../../../api';
import { SendMessageHook } from '../../../../hooks';
import { UserProfileIconView } from '../../../shared/user-profile-icon/UserProfileIconView';
import { MessengerFriend } from '../../common/MessengerFriend';
import { FriendsGroupItemViewProps } from './FriendsGroupItemView.types';

export const FriendsGroupItemView: FC<FriendsGroupItemViewProps> = props =>
{
    const { friend = null } = props;

    const [ isExpanded, setIsExpanded ] = useState<boolean>(false);

    const followFriend = useCallback(() =>
    {
        if(!friend) return;
        
        SendMessageHook(new FollowFriendMessageComposer(friend.id));
    }, [ friend ]);

    const openMessengerChat = useCallback(() =>
    {
        if(!friend) return;
        
        OpenMessengerChat(friend.id);
    }, [ friend ]);

    const getCurrentRelationshipName = useCallback(() =>
    {
        if(!friend) return 'none';

        switch(friend.relationshipStatus)
        {
            case MessengerFriend.RELATIONSHIP_HEART: return 'heart';
            case MessengerFriend.RELATIONSHIP_SMILE: return 'smile';
            case MessengerFriend.RELATIONSHIP_BOBBA: return 'bobba';
            default: return 'none';
        }
    }, [ friend ]);

    const updateRelationship = useCallback((type: number) =>
    {
        if(type !== friend.relationshipStatus) SendMessageHook(new SetRelationshipStatusComposer(friend.id, type));
        
        setIsExpanded(false);
    }, [ friend ]);

    if(!friend) return null;

    return (
        <div className="px-2 py-1 d-flex gap-1 align-items-center">
            <UserProfileIconView userId={ friend.id } />
            <div>{ friend.name }</div>
            <div className="ms-auto d-flex align-items-center gap-1">
                { !isExpanded && <>
                    { friend.followingAllowed && <i onClick={ followFriend } className="icon icon-friendlist-follow cursor-pointer" title={ LocalizeText('friendlist.tip.follow') } /> }
                    { friend.online && <i className="icon icon-friendlist-chat cursor-pointer" onClick={ openMessengerChat } title={ LocalizeText('friendlist.tip.im') } /> }
                    <i className={ 'icon cursor-pointer icon-relationship-' + getCurrentRelationshipName() } onClick={ () => setIsExpanded(true) } title={ LocalizeText('infostand.link.relationship') } />
                    </> }
                { isExpanded && <>
                    <i className="icon icon-relationship-heart cursor-pointer" onClick={ () => updateRelationship(MessengerFriend.RELATIONSHIP_HEART) } />
                    <i className="icon icon-relationship-smile cursor-pointer" onClick={ () => updateRelationship(MessengerFriend.RELATIONSHIP_SMILE) } />
                    <i className="icon icon-relationship-bobba cursor-pointer" onClick={ () => updateRelationship(MessengerFriend.RELATIONSHIP_BOBBA) } />
                    <i className="icon icon-relationship-none cursor-pointer" onClick={ () => updateRelationship(MessengerFriend.RELATIONSHIP_NONE) } />
                </> }
            </div>
        </div>
    );
}
