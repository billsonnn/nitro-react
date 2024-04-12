import { CreateLinkEvent, GetRoomEngine, GetSessionDataManager, MouseEventType, RoomObjectCategory } from '@nitrots/nitro-renderer';
import { Dispatch, FC, PropsWithChildren, SetStateAction, useEffect, useRef } from 'react';
import { DispatchUiEvent, GetConfigurationValue, GetRoomSession, GetUserProfile } from '../../api';
import { Flex, LayoutItemCountView } from '../../common';
import { GuideToolEvent } from '../../events';

interface ToolbarMeViewProps
{
    useGuideTool: boolean;
    unseenAchievementCount: number;
    setMeExpanded: Dispatch<SetStateAction<boolean>>;
}

export const ToolbarMeView: FC<PropsWithChildren<ToolbarMeViewProps>> = props =>
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
        <Flex alignItems="center" className="nitro-toolbar-me p-2" gap={ 2 } innerRef={ elementRef }>
            { (GetConfigurationValue('guides.enabled') && useGuideTool) &&
                <div className="navigation-item icon icon-me-helper-tool cursor-pointer" onClick={ event => DispatchUiEvent(new GuideToolEvent(GuideToolEvent.TOGGLE_GUIDE_TOOL)) } /> }
            <div className="navigation-item icon icon-me-achievements cursor-pointer" onClick={ event => CreateLinkEvent('achievements/toggle') }>
                { (unseenAchievementCount > 0) &&
                    <LayoutItemCountView count={ unseenAchievementCount } /> }
            </div>
            <div className="navigation-item icon icon-me-profile cursor-pointer" onClick={ event => GetUserProfile(GetSessionDataManager().userId) } />
            <div className="navigation-item icon icon-me-rooms cursor-pointer" onClick={ event => CreateLinkEvent('navigator/search/myworld_view') } />
            <div className="navigation-item icon icon-me-clothing cursor-pointer" onClick={ event => CreateLinkEvent('avatar-editor/toggle') } />
            <div className="navigation-item icon icon-me-settings cursor-pointer" onClick={ event => CreateLinkEvent('user-settings/toggle') } />
            { children }
        </Flex>
    );
}
