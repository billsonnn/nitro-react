import { NitroEvent, RoomSessionFriendRequestEvent, RoomWidgetEnum } from '@nitrots/nitro-renderer';
import { FriendRequestEvent, FriendsAcceptFriendRequestEvent, FriendsDeclineFriendRequestEvent } from '../../../../../events';
import { dispatchUiEvent } from '../../../../../hooks';
import { RoomWidgetUpdateEvent, RoomWidgetUpdateFriendRequestEvent } from '../events';
import { RoomWidgetFriendRequestMessage, RoomWidgetMessage } from '../messages';
import { RoomWidgetHandler } from './RoomWidgetHandler';

export class FriendRequestHandler extends RoomWidgetHandler
{
    public processEvent(event: NitroEvent): void
    {
        const friendRequestEvent = (event as RoomSessionFriendRequestEvent);

        switch(event.type)
        {
            case RoomSessionFriendRequestEvent.RSFRE_FRIEND_REQUEST:
                this.container.eventDispatcher.dispatchEvent(new RoomWidgetUpdateFriendRequestEvent(RoomWidgetUpdateFriendRequestEvent.SHOW_FRIEND_REQUEST, friendRequestEvent.requestId, friendRequestEvent.userId, friendRequestEvent.userName));
                return;
            case FriendRequestEvent.ACCEPTED:
            case FriendRequestEvent.DECLINED:
                this.container.eventDispatcher.dispatchEvent(new RoomWidgetUpdateFriendRequestEvent(RoomWidgetUpdateFriendRequestEvent.HIDE_FRIEND_REQUEST, friendRequestEvent.requestId));
                return;
        }
    }

    public processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        const friendMessage = (message as RoomWidgetFriendRequestMessage);

        switch(message.type)
        {
            case RoomWidgetFriendRequestMessage.ACCEPT:
                dispatchUiEvent(new FriendsAcceptFriendRequestEvent(friendMessage.requestId));
                break;
            case RoomWidgetFriendRequestMessage.DECLINE:
                dispatchUiEvent(new FriendsDeclineFriendRequestEvent(friendMessage.requestId));
                break;

        }

        return null;
    }

    public get type(): string
    {
        return RoomWidgetEnum.FRIEND_REQUEST;
    }

    public get eventTypes(): string[]
    {
        return [
            RoomSessionFriendRequestEvent.RSFRE_FRIEND_REQUEST,
            FriendRequestEvent.ACCEPTED,
            FriendRequestEvent.DECLINED
        ];
    }

    public get messageTypes(): string[]
    {
        return [
            RoomWidgetFriendRequestMessage.ACCEPT,
            RoomWidgetFriendRequestMessage.DECLINE
        ];
    }
}
