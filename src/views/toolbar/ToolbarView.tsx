import { Dispose, DropBounce, EaseOut, FigureUpdateEvent, JumpBy, Motions, NitroToolbarAnimateIconEvent, Queue, UserInfoDataParser, UserInfoEvent, Wait } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { CreateLinkEvent, GetRoomSession, GetRoomSessionManager, GetSessionDataManager, GetUserProfile, GoToDesktop, OpenMessengerChat } from '../../api';
import { AvatarEditorEvent, CatalogEvent, FriendsEvent, FriendsMessengerIconEvent, FriendsRequestCountEvent, InventoryEvent, NavigatorEvent, RoomWidgetCameraEvent } from '../../events';
import { AchievementsUIEvent, AchievementsUIUnseenCountEvent } from '../../events/achievements';
import { UnseenItemTrackerUpdateEvent } from '../../events/inventory/UnseenItemTrackerUpdateEvent';
import { ModToolsEvent } from '../../events/mod-tools/ModToolsEvent';
import { UserSettingsUIEvent } from '../../events/user-settings/UserSettingsUIEvent';
import { dispatchUiEvent, useRoomEngineEvent, useUiEvent } from '../../hooks';
import { CreateMessageHook } from '../../hooks/messages/message-event';
import { TransitionAnimation } from '../../layout/transitions/TransitionAnimation';
import { TransitionAnimationTypes } from '../../layout/transitions/TransitionAnimation.types';
import { AvatarImageView } from '../shared/avatar-image/AvatarImageView';
import { ItemCountView } from '../shared/item-count/ItemCountView';
import { ToolbarMeView } from './me/ToolbarMeView';
import { ToolbarViewItems, ToolbarViewProps } from './ToolbarView.types';

const CHAT_ICON_HIDDEN: number = 0;
const CHAT_ICON_SHOWING: number = 1;
const CHAT_ICON_UNREAD: number = 2;

export const ToolbarView: FC<ToolbarViewProps> = props =>
{
    const { isInRoom } = props;

    const [ userInfo, setUserInfo ] = useState<UserInfoDataParser>(null);
    const [ userFigure, setUserFigure ] = useState<string>(null);
    const [ isMeExpanded, setMeExpanded ] = useState(false);
    const [ chatIconType, setChatIconType ] = useState(CHAT_ICON_HIDDEN);
    const [ unseenInventoryCount, setUnseenInventoryCount ] = useState(0);
    const [ unseenAchievementCount, setUnseenAchievementCount ] = useState(0);
    const [ unseenFriendRequestCount, setFriendRequestCount ] = useState(0);
    const isMod = GetSessionDataManager().isModerator;

    const onUserInfoEvent = useCallback((event: UserInfoEvent) =>
    {
        const parser = event.getParser();

        setUserInfo(parser.userInfo);
        setUserFigure(parser.userInfo.figure);
    }, []);

    CreateMessageHook(UserInfoEvent, onUserInfoEvent);

    const onUserFigureEvent = useCallback((event: FigureUpdateEvent) =>
    {
        const parser = event.getParser();

        setUserFigure(parser.figure);
    }, []);
    
    CreateMessageHook(FigureUpdateEvent, onUserFigureEvent);

    const onFriendsMessengerIconEvent = useCallback((event: FriendsMessengerIconEvent) =>
    {
        setChatIconType(event.iconType);
    }, []);

    useUiEvent(FriendsMessengerIconEvent.UPDATE_ICON, onFriendsMessengerIconEvent);

    const onUnseenItemTrackerUpdateEvent = useCallback((event: UnseenItemTrackerUpdateEvent) =>
    {
        setUnseenInventoryCount(event.count);
    }, []);

    useUiEvent(UnseenItemTrackerUpdateEvent.UPDATE_COUNT, onUnseenItemTrackerUpdateEvent);

    const onAchievementsUIUnseenCountEvent = useCallback((event: AchievementsUIUnseenCountEvent) =>
    {
        setUnseenAchievementCount(event.count);
    }, []);

    useUiEvent(AchievementsUIUnseenCountEvent.UNSEEN_COUNT, onAchievementsUIUnseenCountEvent);

    const onFriendsRequestCountEvent = useCallback((event: FriendsRequestCountEvent) =>
    {
        setFriendRequestCount(event.count);
    }, []);

    useUiEvent(FriendsRequestCountEvent.UPDATE_COUNT, onFriendsRequestCountEvent);

    const animationIconToToolbar = useCallback((iconName: string, image: HTMLImageElement, x: number, y: number) =>
    {
        const target = (document.body.getElementsByClassName(iconName)[0] as HTMLElement);

        if(!target) return;
        
        image.className = 'toolbar-icon-animation';
        image.style.visibility = 'visible';
        image.style.left = (x + 'px');
        image.style.top = (y + 'px');

        document.body.append(image);

        const targetBounds  = target.getBoundingClientRect();
        const imageBounds   = image.getBoundingClientRect();

        const left = (imageBounds.x - targetBounds.x);
        const top = (imageBounds.y - targetBounds.y);
        const squared = Math.sqrt(((left * left) + (top * top)));
        const wait = (500 - Math.abs(((((1 / squared) * 100) * 500) * 0.5)));
        const height = 20;

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
                dispatchUiEvent(new CatalogEvent(FriendsEvent.TOGGLE_FRIEND_LIST));
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
            case ToolbarViewItems.PROFILE_ITEM:
                GetUserProfile(GetSessionDataManager().userId);
                setMeExpanded(false);
                return;
            case ToolbarViewItems.SETTINGS_ITEM:
                dispatchUiEvent(new UserSettingsUIEvent(UserSettingsUIEvent.TOGGLE_USER_SETTINGS));
                setMeExpanded(false);
                return;
            case ToolbarViewItems.FRIEND_CHAT_ITEM:
                OpenMessengerChat();
                return;
        }
    }, []);

    const visitDesktop = useCallback(() =>
    {
        if(!GetRoomSession()) return;

        GoToDesktop();
        GetRoomSessionManager().removeSession(-1);
    }, []);

    return (
        <div className="nitro-toolbar-container">
            <TransitionAnimation type={ TransitionAnimationTypes.FADE_IN } inProp={ isMeExpanded } timeout={ 300 }>
                <ToolbarMeView unseenAchievementCount={ unseenAchievementCount } handleToolbarItemClick={ handleToolbarItemClick } />
            </TransitionAnimation>
            <div className="d-flex justify-content-between align-items-center nitro-toolbar py-1 px-3">
                <div className="d-flex align-items-center">
                    <div className="navigation-items gap-2">
                        <div className={ 'navigation-item item-avatar ' + (isMeExpanded ? 'active ' : '') } onClick={ event => setMeExpanded(!isMeExpanded) }>
                            <AvatarImageView figure={ userFigure } direction={ 2 } />
                            { (unseenAchievementCount > 0) &&
                                <ItemCountView count={ unseenAchievementCount } /> }
                        </div>
                        { isInRoom && (
                            <div className="navigation-item" onClick={ visitDesktop }>
                                <i className="icon icon-habbo"></i>
                            </div>) }
                        { !isInRoom && (
                            <div className="navigation-item" onClick={ event => CreateLinkEvent('navigator/goto/home') }>
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
                            { (unseenInventoryCount > 0) &&
                                <ItemCountView count={ unseenInventoryCount } /> }
                        </div>
                        { isInRoom && (
                            <div className="navigation-item" onClick={ event => handleToolbarItemClick(ToolbarViewItems.CAMERA_ITEM) }>
                                <i className="icon icon-camera"></i>
                            </div>) }
                        { isMod && (
                            <div className="navigation-item" onClick={ event => handleToolbarItemClick(ToolbarViewItems.MOD_TOOLS_ITEM) }>
                            <i className="icon icon-modtools"></i>
                        </div>) }
                    </div>
                    <div id="toolbar-chat-input-container" className="d-flex align-items-center" />
                </div>
                <div className="d-flex align-items-center gap-2">
                    <div className="navigation-items gap-2">
                        <div className="navigation-item" onClick={ event => handleToolbarItemClick(ToolbarViewItems.FRIEND_LIST_ITEM) }>
                            <i className="icon icon-friendall"></i>
                            { (unseenFriendRequestCount > 0) &&
                                <ItemCountView count={ unseenFriendRequestCount } /> }
                        </div>
                        { ((chatIconType === CHAT_ICON_SHOWING) || (chatIconType === CHAT_ICON_UNREAD)) &&
                            <div className="navigation-item" onClick={ event => handleToolbarItemClick(ToolbarViewItems.FRIEND_CHAT_ITEM) }>
                                { (chatIconType === CHAT_ICON_SHOWING) && <i className="icon icon-message" /> }
                                { (chatIconType === CHAT_ICON_UNREAD) && <i className="icon icon-message is-unseen" /> }
                            </div> }
                    </div>
                    <div id="toolbar-friend-bar-container" className="d-none d-lg-block" />
                </div>
            </div>
        </div>
    );
}
