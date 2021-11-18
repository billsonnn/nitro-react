import { FC } from 'react';
import { GetSessionDataManager } from '../../../../api';
import { NitroLayoutFlex } from '../../../../layout';
import { NitroLayoutBase } from '../../../../layout/base';
import { AvatarImageView } from '../../../shared/avatar-image/AvatarImageView';
import { MessengerThreadChat } from '../../common/MessengerThreadChat';
import { FriendsMessengerThreadGroupProps } from './FriendsMessengerThreadGroup.types';

export const FriendsMessengerThreadGroup: FC<FriendsMessengerThreadGroupProps> = props =>
{
    const { thread = null, group = null } = props;

    if(!thread || !group) return null;

    if(group.userId === -1)
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
        <NitroLayoutFlex className={ 'w-100 justify-content-' + (group.userId === 0 ? 'end' : 'start') } gap={ 2 }>
            { (group.userId > 0) &&
                <NitroLayoutBase className="message-avatar flex-shrink-0">
                    <AvatarImageView figure={ thread.participant.figure } direction={ 2 } />
                </NitroLayoutBase> }
            <NitroLayoutBase className={ 'bg-light text-black border-radius mb-2 rounded py-1 px-2 messages-group-' + (group.userId === 0 ? 'right' : 'left') }>
                { group.chats.map((chat, index) => <NitroLayoutBase key={ index } className="text-break">{ chat.message }</NitroLayoutBase>) }
            </NitroLayoutBase>
            { (group.userId === 0) &&
                <NitroLayoutBase className="message-avatar flex-shrink-0">
                    <AvatarImageView figure={ GetSessionDataManager().figure } direction={ 4 } />
                </NitroLayoutBase> }
        </NitroLayoutFlex>
    );
}
