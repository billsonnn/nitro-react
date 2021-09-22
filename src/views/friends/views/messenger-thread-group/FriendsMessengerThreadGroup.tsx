import { FC } from 'react';
import { GetSessionDataManager } from '../../../../api';
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
                            <div key={ index } className="text-break">
                                { chat.type === MessengerThreadChat.SECURITY_NOTIFICATION &&
                                    <div className="bg-light rounded mb-2 d-flex gap-2 px-2 py-1 small text-muted align-items-center">
                                        <i className="icon icon-friendlist-warning flex-shrink-0" />
                                        <div>{ chat.message }</div>
                                    </div> }
                            </div>
                        );
                    }) }
            </div>
        );
    }

    return (
        <div className={ 'd-flex gap-2 w-100 justify-content-' + (group.userId === 0 ? 'end' : 'start') }>
            { (group.userId > 0) &&
                <div className="message-avatar flex-shrink-0">
                    <AvatarImageView figure={ thread.participant.figure } direction={ 2 } />
                </div> }
            <div className={ 'bg-light text-black border-radius mb-2 rounded py-1 px-2 messages-group-' + (group.userId === 0 ? 'right' : 'left') }>
                { group.chats.map((chat, index) => <div key={ index } className="text-break">{ chat.message }</div>) }
            </div>
            { (group.userId === 0) &&
                <div className="message-avatar flex-shrink-0">
                    <AvatarImageView figure={ GetSessionDataManager().figure } direction={ 4 } />
                </div> }
        </div>
    );
}
