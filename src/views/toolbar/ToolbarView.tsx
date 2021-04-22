import { UserInfoEvent } from 'nitro-renderer/src/nitro/communication/messages/incoming/user/data/UserInfoEvent';
import { UserInfoDataParser } from 'nitro-renderer/src/nitro/communication/messages/parser/user/data/UserInfoDataParser';
import { MouseEvent, useCallback, useState } from 'react';
import { CatalogEvent, InventoryEvent, NavigatorEvent } from '../../events';
import { dispatchUiEvent } from '../../hooks/events/ui/ui-event';
import { CreateMessageHook } from '../../hooks/messages/message-event';
import { AvatarImageView } from '../avatar-image/AvatarImageView';
import { ToolbarViewItems, ToolbarViewProps } from './ToolbarView.types';

export function ToolbarView(props: ToolbarViewProps): JSX.Element
{
    const { isInRoom } = props;

    const [ userInfo, setUserInfo ] = useState<UserInfoDataParser>(null);

    const unseenInventoryCount = 0;
    const unseenFriendListCount = 0;
    const unseenAchievementsCount = 0;

    const onUserInfoEvent = useCallback((event: UserInfoEvent) =>
    {
        const parser = event.getParser();

        setUserInfo(parser.userInfo);
    }, []);

    function handleToolbarItemClick(event: MouseEvent, item: string): void
    {
        event.preventDefault();

        switch(item)
        {
            case ToolbarViewItems.NAVIGATOR_ITEM:
                dispatchUiEvent(new NavigatorEvent(NavigatorEvent.TOGGLE_NAVIGATOR));
                return;
            case ToolbarViewItems.INVENTORY_ITEM:
                dispatchUiEvent(new InventoryEvent(InventoryEvent.TOGGLE_INVENTORY));
                return;
            case ToolbarViewItems.CATALOG_ITEM:
                dispatchUiEvent(new CatalogEvent(CatalogEvent.TOGGLE_CATALOG));
                return;
        }
    }

    CreateMessageHook(UserInfoEvent, onUserInfoEvent);

    return (
        <>
            <div className="d-flex flex-column bg-primary rounded shadow border border-black p-0 h-100">
                <ul className="flex-grow-1 list-group p-1">
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
                    <li className="list-group-item" onClick={ event => handleToolbarItemClick(event, ToolbarViewItems.CATALOG_ITEM) }>
                        <i className="icon icon-catalog"></i>
                    </li>
                    <li className="list-group-item" onClick={ event => handleToolbarItemClick(event, ToolbarViewItems.INVENTORY_ITEM) }>
                        <i className="icon icon-inventory"></i>
                        { (unseenInventoryCount > 0) && (
                            <div className="position-absolute bg-danger px-1 py-0 rounded shadow count">{ unseenInventoryCount }</div>) }
                    </li>
                    <li className="list-group-item">
                        <i className="icon icon-friendall"></i>
                        { (unseenFriendListCount > 0) && (
                            <div className="position-absolute bg-danger px-1 py-0 rounded shadow count">{ unseenFriendListCount }</div>) }
                    </li>
                </ul>
                <ul className="list-group p-1">
                    <li className="position-relative list-group-item">
                        { userInfo && <AvatarImageView figure={ userInfo.figure } direction={ 2 } headOnly={ true } /> }
                        { (unseenAchievementsCount > 0) && (
                            <div className="position-absolute bg-danger px-1 py-0 rounded shadow count">{ unseenAchievementsCount }</div>) }
                    </li>
                </ul>
            </div>
        </>
    );
}
