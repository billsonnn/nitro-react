import { FC, useMemo } from 'react';
import { GetGroupChatData, GetSessionDataManager, GroupType, LocalizeText, MessengerThread, MessengerThreadChat, MessengerThreadChatGroup } from '../../../../api';
import { Base, Flex, LayoutAvatarImageView } from '../../../../common';

export const FriendsMessengerThreadView: FC<{ thread: MessengerThread }> = props =>
{
    const { thread = null } = props;

    const FriendsMessengerThreadGroup: FC<{ thread: MessengerThread, group: MessengerThreadChatGroup }> = props =>
    {
        const { thread = null, group = null, ...rest } = props;

        const isOwnChat = useMemo(() =>
        {
            if(!thread || !group) return false;
            
            if(group.type === GroupType.PRIVATE_CHAT && (group.userId === GetSessionDataManager().userId)) return true;

            if( (group.type === GroupType.GROUP_CHAT) && (group.chats.length && GetGroupChatData(group.chats[0].extraData).userId === GetSessionDataManager().userId)) return true;

            return false;
        }, [ group, thread ]);

        if(!thread || !group) return null;
        
        if(!group.userId)
        {
            return (
                    <>
                    { group.chats.map((chat, index) =>
                        {
                            return (
                                <Flex key={ index } fullWidth justifyContent="start" gap={ 2 }>
                                    <Base className="w-100 text-break">
                                        { (chat.type === MessengerThreadChat.SECURITY_NOTIFICATION) &&
                                            <Base className="bg-light rounded mb-2 d-flex gap-2 px-2 py-1 small text-muted align-items-center">
                                                <Base className="nitro-friends-spritesheet icon-warning flex-shrink-0" />
                                                <Base>{ chat.message }</Base>
                                            </Base> }
                                        { (chat.type === MessengerThreadChat.ROOM_INVITE) &&
                                                <Base className="bg-light rounded mb-2 d-flex gap-2 px-2 py-1 small text-black align-items-center">
                                                <Base className="messenger-notification-icon flex-shrink-0" />
                                                <Base>{ `${ LocalizeText('messenger.invitation') } ${ chat.message }` }</Base>
                                            </Base> }
                                    </Base>
                                </Flex>
                            );
                        }) }
                </>
            );
        }
        
        return (
            <Flex className={ 'w-100 justify-content-' + (isOwnChat ? 'end' : 'start') } gap={ 2 } { ...rest }>
                    <Base className="message-avatar flex-shrink-0">
                    { (group.type === GroupType.PRIVATE_CHAT && !isOwnChat) &&
                        <LayoutAvatarImageView figure={ thread.participant.figure } direction={ 2 } />
                    }
                    { (group.type === GroupType.GROUP_CHAT && !isOwnChat) &&
                        <LayoutAvatarImageView figure={ GetGroupChatData(group.chats[0].extraData).figure } direction={ 2} />
                    }
                    </Base>
                <Base className={ 'bg-light text-black border-radius mb-2 rounded py-1 px-2 messages-group-' + (isOwnChat ? 'right' : 'left') }>
                    <Base className='fw-bold'>
                        { (isOwnChat) && GetSessionDataManager().userName }
                        { (!isOwnChat) && ((group.type === GroupType.GROUP_CHAT) ? GetGroupChatData(group.chats[0].extraData).username : thread.participant.name)
                        }
                    </Base>
                    { group.chats.map((chat, index) =><Base key={ index } className="text-break">{ chat.message }</Base>) }
                </Base>
                { (isOwnChat) &&
                    <Base className="message-avatar flex-shrink-0">
                        <LayoutAvatarImageView figure={ GetSessionDataManager().figure } direction={ 4 } />
                    </Base> }
            </Flex>
        );
    }

    return (
        <>
            { (thread.groups.length > 0) && thread.groups.map((group, index) => <FriendsMessengerThreadGroup key={ index } thread={ thread } group={ group } />) }
        </>
    );
}
