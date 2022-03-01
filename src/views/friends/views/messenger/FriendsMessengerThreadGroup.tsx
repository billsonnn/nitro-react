import { FC, useMemo } from 'react';
import { GetSessionDataManager } from '../../../../api';
import { NitroLayoutFlex } from '../../../../layout';
import { NitroLayoutBase } from '../../../../layout/base';
import { AvatarImageView } from '../../../shared/avatar-image/AvatarImageView';
import { GroupType } from '../../common/GroupType';
import { MessengerThread } from '../../common/MessengerThread';
import { MessengerThreadChat } from '../../common/MessengerThreadChat';
import { MessengerThreadChatGroup } from '../../common/MessengerThreadChatGroup';
import { getGroupChatData } from '../../common/Utils';

interface FriendsMessengerThreadGroupProps
{
    thread: MessengerThread;
    group: MessengerThreadChatGroup;
}

export const FriendsMessengerThreadGroup: FC<FriendsMessengerThreadGroupProps> = props =>
{
    const { thread = null, group = null } = props;

    const isOwnChat = useMemo(() =>
    {
        if(!thread || !group) return false;
        
        if(group.type === GroupType.PRIVATE_CHAT && (group.userId === GetSessionDataManager().userId)) return true;

        if( (group.type === GroupType.GROUP_CHAT) && (group.chats.length && getGroupChatData(group.chats[0].extraData).userId === GetSessionDataManager().userId)) return true;

        return false;
    }, [group, thread]);

    if(!thread || !group) return null;
    
    if(!group.userId)
    {
        return (
            <div className="d-flex gap-2 w-100 justify-content-start">
                { group.chats.map((chat, index) =>
                    {
                        return (
                            <NitroLayoutBase key={ index } className="text-break">
                                { chat.type === MessengerThreadChat.SECURITY_NOTIFICATION &&
                                    <NitroLayoutBase className="bg-light rounded mb-2 d-flex gap-2 px-2 py-1 small text-muted align-items-center">
                                        <NitroLayoutBase className="nitro-friends-spritesheet icon-warning flex-shrink-0" />
                                        <NitroLayoutBase>{ chat.message }</NitroLayoutBase>
                                    </NitroLayoutBase> }
                            </NitroLayoutBase>
                        );
                    }) }
            </div>
        );
    }
    
    return (
        <NitroLayoutFlex className={ 'w-100 justify-content-' + (isOwnChat ? 'end' : 'start') } gap={ 2 }>
                <NitroLayoutBase className="message-avatar flex-shrink-0">
                { (group.type === GroupType.PRIVATE_CHAT && !isOwnChat) &&
                    <AvatarImageView figure={ thread.participant.figure } direction={ 2 } />
                }
                { (group.type === GroupType.GROUP_CHAT && !isOwnChat) &&
                    <AvatarImageView figure={ getGroupChatData(group.chats[0].extraData).figure } direction={ 2} />
                }
                </NitroLayoutBase>
            <NitroLayoutBase className={ 'bg-light text-black border-radius mb-2 rounded py-1 px-2 messages-group-' + (isOwnChat ? 'right' : 'left') }>
                <NitroLayoutBase className='fw-bold'>
                    {
                        (isOwnChat) && GetSessionDataManager().userName
                    }
                    { (!isOwnChat) && ((group.type === GroupType.GROUP_CHAT) ? getGroupChatData(group.chats[0].extraData).username : thread.participant.name)
                    }
                </NitroLayoutBase>
                { group.chats.map((chat, index) =><NitroLayoutBase key={ index } className="text-break">{ chat.message }</NitroLayoutBase>) }
            </NitroLayoutBase>
            { (isOwnChat) &&
                <NitroLayoutBase className="message-avatar flex-shrink-0">
                    <AvatarImageView figure={ GetSessionDataManager().figure } direction={ 4 } />
                </NitroLayoutBase> }
        </NitroLayoutFlex>
    );
}
