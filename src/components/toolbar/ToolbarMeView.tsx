import { RoomObjectCategory } from '@nitrots/nitro-renderer';
import { FC, useEffect } from 'react';
import { CreateLinkEvent, GetRoomEngine, GetRoomSession } from '../../api';
import { Base, Flex, LayoutItemCountView } from '../../common';
import { ToolbarViewItems } from './common/ToolbarViewItems';

export interface ToolbarMeViewProps
{
    useGuideTool: boolean;
    unseenAchievementCount: number;
    handleToolbarItemClick: (item: string) => void;
}

export const ToolbarMeView: FC<ToolbarMeViewProps> = props =>
{
    const { useGuideTool = false, unseenAchievementCount = 0, handleToolbarItemClick = null } = props;

    useEffect(() =>
    {
        const roomSession = GetRoomSession();

        if(!roomSession) return;

        GetRoomEngine().selectRoomObject(roomSession.roomId, roomSession.ownRoomIndex, RoomObjectCategory.UNIT);
    }, []);

    return (
        <Flex alignItems="center" className="nitro-toolbar-me p-2" gap={ 2 }>
            { useGuideTool &&
                <Base pointer className="navigation-item icon icon-me-helper-tool" onClick={ event => handleToolbarItemClick(ToolbarViewItems.GUIDE_TOOL_ITEM) } /> }
            <Base pointer className="navigation-item icon icon-me-achievements" onClick={ event => handleToolbarItemClick(ToolbarViewItems.ACHIEVEMENTS_ITEM) }>
                { (unseenAchievementCount > 0) &&
                    <LayoutItemCountView count={ unseenAchievementCount } /> }
            </Base>
            <Base pointer className="navigation-item icon icon-me-profile" onClick={ event => handleToolbarItemClick(ToolbarViewItems.PROFILE_ITEM) } />
            <Base pointer className="navigation-item icon icon-me-rooms" onClick={ event => CreateLinkEvent('navigator/search/myworld_view')} />
            <Base pointer className="navigation-item icon icon-me-clothing" onClick={ event => handleToolbarItemClick(ToolbarViewItems.CLOTHING_ITEM) } />
            <Base pointer className="navigation-item icon icon-me-settings" onClick={ event => handleToolbarItemClick(ToolbarViewItems.SETTINGS_ITEM) } />
        </Flex>
    );
}
