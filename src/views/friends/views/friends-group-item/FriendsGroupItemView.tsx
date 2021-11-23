import { FollowFriendMessageComposer, SetRelationshipStatusComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { LocalizeText, OpenMessengerChat } from '../../../../api';
import { SendMessageHook } from '../../../../hooks';
import { NitroLayoutFlex, UserProfileIconView } from '../../../../layout';
import { NitroLayoutBase } from '../../../../layout/base';
import { MessengerFriend } from '../../common/MessengerFriend';
import { FriendsGroupItemViewProps } from './FriendsGroupItemView.types';

export const FriendsGroupItemView: FC<FriendsGroupItemViewProps> = props =>
{
    const { friend = null, selected = false, children = null, ...rest } = props;

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
        <NitroLayoutFlex className="px-2 py-1 align-items-center" gap={ 1 } { ...rest }>
            <UserProfileIconView userId={ friend.id } />
            <div>{ friend.name }</div>
            <NitroLayoutFlex className="ms-auto align-items-center" gap={ 1 }>
                { !isExpanded &&
                    <>
                        { friend.followingAllowed &&
                            <NitroLayoutBase onClick={ followFriend } className="nitro-friends-spritesheet icon-follow cursor-pointer" title={ LocalizeText('friendlist.tip.follow') } /> }
                        { friend.online &&
                            <NitroLayoutBase className="nitro-friends-spritesheet icon-chat cursor-pointer" onClick={ openMessengerChat } title={ LocalizeText('friendlist.tip.im') } /> }
                        <NitroLayoutBase className={ `nitro-friends-spritesheet icon-${ getCurrentRelationshipName() } cursor-pointer` }onClick={ event => setIsExpanded(true) } title={ LocalizeText('infostand.link.relationship') } />
                    </> }
                { isExpanded &&
                    <>
                        <NitroLayoutBase className="nitro-friends-spritesheet icon-heart cursor-pointer" onClick={ () => updateRelationship(MessengerFriend.RELATIONSHIP_HEART) } />
                        <NitroLayoutBase className="nitro-friends-spritesheet icon-smile cursor-pointer" onClick={ () => updateRelationship(MessengerFriend.RELATIONSHIP_SMILE) } />
                        <NitroLayoutBase className="nitro-friends-spritesheet icon-bobba cursor-pointer" onClick={ () => updateRelationship(MessengerFriend.RELATIONSHIP_BOBBA) } />
                        <NitroLayoutBase className="nitro-friends-spritesheet icon-none cursor-pointer" onClick={ () => updateRelationship(MessengerFriend.RELATIONSHIP_NONE) } />
                    </> }
            </NitroLayoutFlex>
            { children }
        </NitroLayoutFlex>
    );
}
