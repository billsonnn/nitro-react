import { CreateLinkEvent, Dispose, DropBounce, EaseOut, GetSessionDataManager, JumpBy, Motions, NitroToolbarAnimateIconEvent, PerkAllowancesMessageEvent, PerkEnum, Queue, Wait } from '@nitrots/nitro-renderer';
import { FC, useState } from 'react';
import { GetConfigurationValue, MessengerIconState, OpenMessengerChat, VisitDesktop } from '../../api';
import { Flex, LayoutAvatarImageView, LayoutItemCountView, TransitionAnimation, TransitionAnimationTypes } from '../../common';
import { useAchievements, useFriends, useInventoryUnseenTracker, useMessageEvent, useMessenger, useNitroEvent, useSessionInfo } from '../../hooks';
import { ToolbarItemView } from './ToolbarItemView';
import { ToolbarMeView } from './ToolbarMeView';

export const ToolbarView: FC<{ isInRoom: boolean }> = props =>
{
    const { isInRoom } = props;
    const [ isMeExpanded, setMeExpanded ] = useState(false);
    const [ useGuideTool, setUseGuideTool ] = useState(false);
    const { userFigure = null } = useSessionInfo();
    const { getFullCount = 0 } = useInventoryUnseenTracker();
    const { getTotalUnseen = 0 } = useAchievements();
    const { requests = [] } = useFriends();
    const { iconState = MessengerIconState.HIDDEN } = useMessenger();
    const isMod = GetSessionDataManager().isModerator;

    useMessageEvent<PerkAllowancesMessageEvent>(PerkAllowancesMessageEvent, event =>
    {
        setUseGuideTool(event.getParser().isAllowed(PerkEnum.USE_GUIDE_TOOL));
    });

    useNitroEvent<NitroToolbarAnimateIconEvent>(NitroToolbarAnimateIconEvent.ANIMATE_ICON, event =>
    {
        const animationIconToToolbar = (iconName: string, image: HTMLImageElement, x: number, y: number) =>
        {
            const target = (document.body.getElementsByClassName(iconName)[0] as HTMLElement);

            if(!target) return;

            image.className = 'toolbar-icon-animation';
            image.style.visibility = 'visible';
            image.style.left = (x + 'px');
            image.style.top = (y + 'px');

            document.body.append(image);

            const targetBounds = target.getBoundingClientRect();
            const imageBounds = image.getBoundingClientRect();

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
        };

        animationIconToToolbar('icon-inventory', event.image, event.x, event.y);
    });

    return (
        <>
            <TransitionAnimation inProp={ isMeExpanded } timeout={ 300 } type={ TransitionAnimationTypes.FADE_IN }>
                <ToolbarMeView setMeExpanded={ setMeExpanded } unseenAchievementCount={ getTotalUnseen } useGuideTool={ useGuideTool } />
            </TransitionAnimation>
            <Flex alignItems="center" className="absolute bottom-[0] left-[0] w-full h-[55px] bg-[rgba(28,_28,_32,_.95)] [box-shadow:inset_0_5px_#22222799,_inset_0_-4px_#12121599] py-1 px-3" gap={ 2 } justifyContent="between">
                <Flex alignItems="center" gap={ 2 }>
                    <Flex alignItems="center" gap={ 2 }>
                        <Flex center pointer className={ 'relative w-[50px] h-[45px] overflow-hidden ' + (isMeExpanded ? 'active ' : '') } onClick={ event => setMeExpanded(!isMeExpanded) }>
                            <LayoutAvatarImageView className="-ml-[5px] mt-[25px]" direction={ 2 } figure={ userFigure } position="absolute" />
                            { (getTotalUnseen > 0) &&
                                <LayoutItemCountView count={ getTotalUnseen } /> }
                        </Flex>
                        { isInRoom &&
                            <ToolbarItemView icon="habbo" onClick={ event => VisitDesktop() } /> }
                        { !isInRoom &&
                            <ToolbarItemView icon="house" onClick={ event => CreateLinkEvent('navigator/goto/home') } /> }
                        <ToolbarItemView icon="rooms" onClick={ event => CreateLinkEvent('navigator/toggle') } />
                        { GetConfigurationValue('game.center.enabled') &&
                            <ToolbarItemView icon="game" onClick={ event => CreateLinkEvent('games/toggle') } /> }
                        <ToolbarItemView icon="catalog" onClick={ event => CreateLinkEvent('catalog/toggle') } />
                        <ToolbarItemView icon="inventory" onClick={ event => CreateLinkEvent('inventory/toggle') }>
                            { (getFullCount > 0) &&
                                <LayoutItemCountView count={ getFullCount } /> }
                        </ToolbarItemView>
                        { isInRoom &&
                            <ToolbarItemView icon="camera" onClick={ event => CreateLinkEvent('camera/toggle') } /> }
                        { isMod &&
                            <ToolbarItemView icon="modtools" onClick={ event => CreateLinkEvent('mod-tools/toggle') } /> }
                    </Flex>
                    <Flex alignItems="center" id="toolbar-chat-input-container" />
                </Flex>
                <Flex alignItems="center" gap={ 2 }>
                    <Flex gap={ 2 }>
                        <ToolbarItemView icon="friendall" onClick={ event => CreateLinkEvent('friends/toggle') }>
                            { (requests.length > 0) &&
                                <LayoutItemCountView count={ requests.length } /> }
                        </ToolbarItemView>
                        { ((iconState === MessengerIconState.SHOW) || (iconState === MessengerIconState.UNREAD)) &&
                            <ToolbarItemView className={ (iconState === MessengerIconState.UNREAD) && 'is-unseen' } icon="message" onClick={ event => OpenMessengerChat() } /> }
                    </Flex>
                    <div className="hidden lg:block" id="toolbar-friend-bar-container" />
                </Flex>
            </Flex>
        </>
    );
};
