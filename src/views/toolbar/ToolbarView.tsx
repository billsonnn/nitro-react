import { UserInfoEvent } from 'nitro-renderer/src/nitro/communication/messages/incoming/user/data/UserInfoEvent';
import { UserInfoDataParser } from 'nitro-renderer/src/nitro/communication/messages/parser/user/data/UserInfoDataParser';
import { useState } from 'react';
import { CreateMessageHook } from '../../hooks/messages/message-event';
import { AvatarImageView } from '../avatar-image/AvatarImageView';
import { ToolbarViewProps } from './ToolbarView.types';

export function ToolbarView(props: ToolbarViewProps): JSX.Element
{
    const [ isInRoom, setIsInRoom ] = useState(false);

    const [ userInfo, setUserInfo ] = useState<UserInfoDataParser>(null);

    const unseenInventoryCount = 0;
    const unseenFriendListCount = 0;
    const unseenAchievementsCount = 0;

    const onUserInfoEvent = (event: UserInfoEvent) =>
    {
        const parser = event.getParser();

        setUserInfo(parser.userInfo);
    };

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
                    <li className="list-group-item">
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
