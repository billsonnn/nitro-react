import { MouseEventType, RoomObjectCategory } from '@nitrots/nitro-renderer';
import { Dispatch, FC, SetStateAction, useEffect, useRef } from 'react';
import { CreateLinkEvent, GetRoomEngine, GetRoomSession, GetSessionDataManager, GetUserProfile } from '../../api';
import { Base, Flex, LayoutItemCountView } from '../../common';
import { GuideToolEvent, UserSettingsUIEvent } from '../../events';
import { DispatchUiEvent } from '../../hooks';

interface ToolbarMeViewProps
{
    useGuideTool: boolean;
    unseenAchievementCount: number;
    setMeExpanded: Dispatch<SetStateAction<boolean>>;
}

export const ToolbarMeView: FC<ToolbarMeViewProps> = props =>
{
    const { useGuideTool = false, unseenAchievementCount = 0, setMeExpanded = null, children = null, ...rest } = props;
    const elementRef = useRef<HTMLDivElement>();

    useEffect(() =>
    {
        const roomSession = GetRoomSession();

        if(!roomSession) return;

        GetRoomEngine().selectRoomObject(roomSession.roomId, roomSession.ownRoomIndex, RoomObjectCategory.UNIT);
    }, []);

    useEffect(() =>
    {
        const onClick = (event: MouseEvent) => setMeExpanded(false);

        document.addEventListener('click', onClick);

        return () => document.removeEventListener(MouseEventType.MOUSE_CLICK, onClick);
    }, [ setMeExpanded ]);

    return (
        <Flex innerRef={ elementRef } alignItems="center" className="nitro-toolbar-me p-2" gap={ 2 }>
            { useGuideTool &&
                <Base pointer className="navigation-item icon icon-me-helper-tool" onClick={ event => DispatchUiEvent(new GuideToolEvent(GuideToolEvent.TOGGLE_GUIDE_TOOL)) } /> }
            <Base pointer className="navigation-item icon icon-me-achievements" onClick={ event => CreateLinkEvent('achievements/toggle') }>
                { (unseenAchievementCount > 0) &&
                    <LayoutItemCountView count={ unseenAchievementCount } /> }
            </Base>
            <Base pointer className="navigation-item icon icon-me-profile" onClick={ event => GetUserProfile(GetSessionDataManager().userId) } />
            <Base pointer className="navigation-item icon icon-me-rooms" onClick={ event => CreateLinkEvent('navigator/search/myworld_view')} />
            <Base pointer className="navigation-item icon icon-me-clothing" onClick={ event => CreateLinkEvent('avatar-editor/toggle') } />
            <Base pointer className="navigation-item icon icon-me-settings" onClick={ event => DispatchUiEvent(new UserSettingsUIEvent(UserSettingsUIEvent.TOGGLE_USER_SETTINGS)) } />
            { children }
        </Flex>
    );
}
