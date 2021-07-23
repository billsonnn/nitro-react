import { DesktopViewComposer, Dispose, DropBounce, EaseOut, JumpBy, Motions, NitroToolbarAnimateIconEvent, Queue, UserFigureEvent, UserInfoDataParser, UserInfoEvent, Wait } from 'nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { GetRoomSession, GetRoomSessionManager } from '../../api';
import { AvatarEditorEvent, CatalogEvent, FriendListEvent, InventoryEvent, NavigatorEvent, RoomWidgetCameraEvent } from '../../events';
import { AchievementsUIEvent } from '../../events/achievements';
import { UnseenItemTrackerUpdateEvent } from '../../events/inventory/UnseenItemTrackerUpdateEvent';
import { ModToolsEvent } from '../../events/mod-tools/ModToolsEvent';
import { dispatchUiEvent, useRoomEngineEvent, useUiEvent } from '../../hooks';
import { CreateMessageHook, SendMessageHook } from '../../hooks/messages/message-event';
import { TransitionAnimation } from '../../layout/transitions/TransitionAnimation';
import { TransitionAnimationTypes } from '../../layout/transitions/TransitionAnimation.types';
import { AvatarImageView } from '../shared/avatar-image/AvatarImageView';
import { ToolbarMeView } from './me/ToolbarMeView';
import { ToolbarViewItems, ToolbarViewProps } from './ToolbarView.types';

export const ToolbarView: FC<ToolbarViewProps> = props =>
{
    const { isInRoom } = props;

    const [ userInfo, setUserInfo ] = useState<UserInfoDataParser>(null);
    const [ userFigure, setUserFigure ] = useState<string>(null);
    const [ isMeExpanded, setMeExpanded ] = useState(false);
    const [ unseenInventoryCount, setUnseenInventoryCount ] = useState(0);

    const unseenFriendListCount = 0;
    const unseenAchievementsCount = 0;

    const onUserInfoEvent = useCallback((event: UserInfoEvent) =>
    {
        const parser = event.getParser();

        setUserInfo(parser.userInfo);
        setUserFigure(parser.userInfo.figure);
    }, []);

    CreateMessageHook(UserInfoEvent, onUserInfoEvent);

    const onUserFigureEvent = useCallback((event: UserFigureEvent) =>
    {
        const parser = event.getParser();

        setUserFigure(parser.figure);
    }, []);
    
    CreateMessageHook(UserFigureEvent, onUserFigureEvent);

    const onUnseenItemTrackerUpdateEvent = useCallback((event: UnseenItemTrackerUpdateEvent) =>
    {
        setUnseenInventoryCount(event.count);
    }, []);

    useUiEvent(UnseenItemTrackerUpdateEvent.UPDATE_COUNT, onUnseenItemTrackerUpdateEvent);

    const animationIconToToolbar = useCallback((iconName: string, image: HTMLImageElement, x: number, y: number) =>
    {
        const target = (document.body.getElementsByClassName(iconName)[0] as HTMLElement);

        if(!target) return;
        
        image.className         = 'toolbar-icon-animation';
        image.style.visibility  = 'visible';
        image.style.left        = (x + 'px');
        image.style.top         = (y + 'px');

        document.body.append(image);

        const targetBounds  = target.getBoundingClientRect();
        const imageBounds   = image.getBoundingClientRect();

        const left    = (imageBounds.x - targetBounds.x);
        const top     = (imageBounds.y - targetBounds.y);
        const squared = Math.sqrt(((left * left) + (top * top)));
        const wait    = (500 - Math.abs(((((1 / squared) * 100) * 500) * 0.5)));
        const height  = 20;

        const motionName = (`ToolbarBouncing[${ iconName }]`);

        if(!Motions.getMotionByTag(motionName))
        {
            Motions.runMotion(new Queue(new Wait((wait + 8)), new DropBounce(target, 400, 12))).tag = motionName;
        }

        const motion = new Queue(new EaseOut(new JumpBy(image, wait, ((targetBounds.x - imageBounds.x) + height), (targetBounds.y - imageBounds.y), 100, 1), 1), new Dispose(image));

        Motions.runMotion(motion);
    }, []);

    const onNitroToolbarAnimateIconEvent = useCallback((event: NitroToolbarAnimateIconEvent) =>
    {
        animationIconToToolbar('icon-inventory', event.image, event.x, event.y);
    }, [ animationIconToToolbar ]);

    useRoomEngineEvent(NitroToolbarAnimateIconEvent.ANIMATE_ICON, onNitroToolbarAnimateIconEvent);

    const handleToolbarItemClick = useCallback((item: string) =>
    {
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
            case ToolbarViewItems.FRIEND_LIST_ITEM:
                dispatchUiEvent(new CatalogEvent(FriendListEvent.TOGGLE_FRIEND_LIST));
                return;
            case ToolbarViewItems.CAMERA_ITEM:
                dispatchUiEvent(new RoomWidgetCameraEvent(RoomWidgetCameraEvent.TOGGLE_CAMERA));
                return;
            case ToolbarViewItems.CLOTHING_ITEM:
                dispatchUiEvent(new AvatarEditorEvent(AvatarEditorEvent.TOGGLE_EDITOR));
                setMeExpanded(false);
                return;
            case ToolbarViewItems.MOD_TOOLS_ITEM:
                dispatchUiEvent(new ModToolsEvent(ModToolsEvent.TOGGLE_MOD_TOOLS));
                return;
            case ToolbarViewItems.ACHIEVEMENTS_ITEM:
                dispatchUiEvent(new AchievementsUIEvent(AchievementsUIEvent.TOGGLE_ACHIEVEMENTS));
                setMeExpanded(false);
                return;
        }
    }, []);

    const visitDesktop = useCallback(() =>
    {
        if(!GetRoomSession()) return;
        
        SendMessageHook(new DesktopViewComposer());
        GetRoomSessionManager().removeSession(-1);
    }, []);

    return (
        <div className="nitro-toolbar-container">
            <TransitionAnimation type={ TransitionAnimationTypes.FADE_IN } inProp={ isMeExpanded } timeout={ 300 }>
                <ToolbarMeView setMeExpanded={ setMeExpanded } handleToolbarItemClick={ handleToolbarItemClick } />
            </TransitionAnimation>
            <div className="d-flex justify-content-between align-items-center nitro-toolbar py-1 px-3">
                <div className="d-flex align-items-center toolbar-left-side">
                    <div className="navigation-items navigation-avatar pe-1 me-2">
                        <div className="navigation-item">
                            <div className={ 'toolbar-avatar ' + (isMeExpanded ? 'active ' : '') } onClick={ event => setMeExpanded(!isMeExpanded) }>
                                <AvatarImageView figure={ userFigure } direction={ 2 } />
                            </div>
                        </div>
                        { (unseenAchievementsCount > 0) && (
                            <div className="position-absolute bg-danger px-1 py-0 rounded shadow count">{ unseenAchievementsCount }</div>) }
                    </div>
                    <div className="navigation-items">
                        { isInRoom && (
                            <div className="navigation-item" onClick={ visitDesktop }>
                                <i className="icon icon-hotelview icon-nitro-light"></i>
                            </div>) }
                        { !isInRoom && (
                            <div className="navigation-item">
                                <i className="icon icon-house"></i>
                            </div>) }
                        <div className="navigation-item" onClick={ event => handleToolbarItemClick(ToolbarViewItems.NAVIGATOR_ITEM) }>
                            <i className="icon icon-rooms"></i>
                        </div>
                        <div className="navigation-item" onClick={ event => handleToolbarItemClick(ToolbarViewItems.CATALOG_ITEM) }>
                            <i className="icon icon-catalog"></i>
                        </div>
                        <div className="navigation-item" onClick={ event => handleToolbarItemClick(ToolbarViewItems.INVENTORY_ITEM) }>
                            <i className="icon icon-inventory"></i>
                            { (unseenInventoryCount > 0) && (
                                <div className="position-absolute bg-danger px-1 py-0 rounded shadow count">{ unseenInventoryCount }</div>) }
                        </div>
                        <div className="navigation-item" onClick={ event => handleToolbarItemClick(ToolbarViewItems.FRIEND_LIST_ITEM) }>
                            <i className="icon icon-friendall"></i>
                            { (unseenFriendListCount > 0) && (
                                <div className="position-absolute bg-danger px-1 py-0 rounded shadow count">{ unseenFriendListCount }</div>) }
                        </div>
                        { isInRoom && (
                            <div className="navigation-item" onClick={ event => handleToolbarItemClick(ToolbarViewItems.CAMERA_ITEM) }>
                                <i className="icon icon-camera"></i>
                            </div>) }
                        <div className="navigation-item" onClick={ event => handleToolbarItemClick(ToolbarViewItems.MOD_TOOLS_ITEM) }>
                            <i className="icon icon-modtools"></i>
                        </div>
                    </div>
                    <div id="toolbar-chat-input-container" className="d-flex align-items-center" />
                </div>
                <div className="d-flex toolbar-right-side">
                    <div id="toolbar-friend-bar-container" />
                </div>
            </div>
        </div>
    );
}
