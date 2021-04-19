import { RoomInfoComposer } from 'nitro-renderer';
import { UserInfoEvent } from 'nitro-renderer/src/nitro/communication/messages/incoming/user/data/UserInfoEvent';
import { UserInfoDataParser } from 'nitro-renderer/src/nitro/communication/messages/parser/user/data/UserInfoDataParser';
import { KeyboardEvent, MouseEvent, useState } from 'react';
import { NavigatorEvent } from '../../events';
import { dispatchUiEvent } from '../../hooks/events/ui/ui-event';
import { CreateMessageHook, SendMessageHook } from '../../hooks/messages/message-event';
import { AvatarImageView } from '../avatar-image/AvatarImageView';
import { ToolbarViewItems, ToolbarViewProps } from './ToolbarView.types';

export function ToolbarView(props: ToolbarViewProps): JSX.Element
{
    const { isInRoom } = props;

    const [ userInfo, setUserInfo ] = useState<UserInfoDataParser>(null);

    const unseenInventoryCount = 0;
    const unseenFriendListCount = 0;
    const unseenAchievementsCount = 0;

    const onUserInfoEvent = (event: UserInfoEvent) =>
    {
        const parser = event.getParser();

        setUserInfo(parser.userInfo);
    };

    function onKeyUp(event: KeyboardEvent<HTMLInputElement>)
    {
        if(event.key !== "Enter") return;

        const roomId = (event.target as HTMLInputElement).value;

        if(roomId.length === 0) return;

        SendMessageHook(new RoomInfoComposer(parseInt(roomId), false, true));
    }

    function handleToolbarItemClick(event: MouseEvent, item: string): void
    {
        event.preventDefault();

        switch(item)
        {
            case ToolbarViewItems.NAVIGATOR_ITEM:
                dispatchUiEvent(new NavigatorEvent(NavigatorEvent.TOGGLE_NAVIGATOR));
                return;
        }
    }

    CreateMessageHook(new UserInfoEvent(onUserInfoEvent));

    return (
        <div className="nitro-toolbar">
            <div className="card p-0 overflow-hidden">
                <ul className="list-group list-group-horizontal p-1">
                    { isInRoom && (
                        <li className="list-group-item">
                        <i className="icon icon-hotelview icon-nitro-light"></i>
                        </li>) }
                    { !isInRoom && (
                        <li className="list-group-item">
                            <i className="icon icon-house"></i>
                        </li>) }
                    <li className="list-group-item" onClick={ event => handleToolbarItemClick(event, ToolbarViewItems.NAVIGATOR_ITEM) }>
                        <i className="icon icon-rooms"></i>
                    </li>
                    <li className="list-group-item">
                        <i className="icon icon-catalog"></i>
                    </li>
                    <li className="list-group-item">
                        <i className="icon icon-inventory"></i>
                        { (unseenInventoryCount > 0) && (
                            <div className="position-absolute bg-danger px-1 py-0 rounded shadow count">{ unseenInventoryCount }</div>) }
                    </li>
                    <li className="list-group-item">
                        <i className="icon icon-friendall"></i>
                        { (unseenFriendListCount > 0) && (
                            <div className="position-absolute bg-danger px-1 py-0 rounded shadow count">{ unseenFriendListCount }</div>) }
                    </li>
                    <li>
                        <input type="number" onKeyUp={ onKeyUp } />
                    </li>
                    <li className="list-group-item">
                        { userInfo && <AvatarImageView figure={ userInfo.figure } direction={ 2 } headOnly={ true } /> }
                        { (unseenAchievementsCount > 0) && (
                            <div className="position-absolute bg-danger px-1 py-0 rounded shadow count">{ unseenAchievementsCount }</div>) }
                    </li>
                </ul>
            </div>
        </div>
    );
}
