import { GetSessionDataManager } from '@nitrots/nitro-renderer';
import { FC, useMemo } from 'react';
import { GetGroupChatData, LocalizeText, MessengerGroupType, MessengerThread, MessengerThreadChat, MessengerThreadChatGroup } from '../../../../../api';
import { Base, Flex, LayoutAvatarImageView } from '../../../../../common';

export const FriendsMessengerThreadGroup: FC<{ thread: MessengerThread, group: MessengerThreadChatGroup }> = props =>
{
    const { thread = null, group = null } = props;

    const groupChatData = useMemo(() => ((group.type === MessengerGroupType.GROUP_CHAT) && GetGroupChatData(group.chats[0].extraData)), [ group ]);

    const isOwnChat = useMemo(() =>
    {
        if(!thread || !group) return false;
        
        if((group.type === MessengerGroupType.PRIVATE_CHAT) && (group.userId === GetSessionDataManager().userId)) return true;

        if(groupChatData && group.chats.length && (groupChatData.userId === GetSessionDataManager().userId)) return true;

        return false;
    }, [ thread, group, groupChatData ]);

    if(!thread || !group) return null;
    
    if(!group.userId)
    {
        return (
            <>
                { group.chats.map((chat, index) =>
                {
                    return (
                        <Flex key={ index } fullWidth gap={ 2 } justifyContent="start">
                            <Base className="w-100 text-break">
                                { (chat.type === MessengerThreadChat.SECURITY_NOTIFICATION) &&
                                    <Flex gap={ 2 } alignItems="center" className="bg-light rounded mb-2 px-2 py-1 small text-muted">
                                        <Base className="nitro-friends-spritesheet icon-warning flex-shrink-0" />
                                        <Base>{ chat.message }</Base>
                                    </Flex> }
                                { (chat.type === MessengerThreadChat.ROOM_INVITE) &&
                                    <Flex gap={ 2 } alignItems="center" className="bg-light rounded mb-2 px-2 py-1 small text-black">
                                        <Base className="messenger-notification-icon flex-shrink-0" />
                                        <Base>{ (LocalizeText('messenger.invitation') + ' ') }{ chat.message }</Base>
                                    </Flex> }
                            </Base>
                        </Flex>
                    );
                }) }
            </>
        );
    }
    
    return (
        <Flex fullWidth justifyContent={ isOwnChat ? 'end' : 'start' } gap={ 2 }>
            <Base shrink className="message-avatar">
                { ((group.type === MessengerGroupType.PRIVATE_CHAT) && !isOwnChat) &&
                    <LayoutAvatarImageView figure={ thread.participant.figure } direction={ 2 } /> }
                { (groupChatData && !isOwnChat) &&
                    <LayoutAvatarImageView figure={ groupChatData.figure } direction={ 2 } /> }
            </Base>
            <Base className={ 'bg-light text-black border-radius mb-2 rounded py-1 px-2 messages-group-' + (isOwnChat ? 'right' : 'left') }>
                <Base className="fw-bold">
                    { isOwnChat && GetSessionDataManager().userName }
                    { !isOwnChat && (groupChatData ? groupChatData.username : thread.participant.name) }
                </Base>
                { group.chats.map((chat, index) => <Base key={ index } className="text-break">{ chat.message }</Base>) }
            </Base>
            { isOwnChat &&
                <Base shrink className="message-avatar">
                    <LayoutAvatarImageView figure={ GetSessionDataManager().figure } direction={ 4 } />
                </Base> }
        </Flex>
    );
}
