import { RoomObjectCategory } from '@nitrots/nitro-renderer';
import { FC, useEffect } from 'react';
import { GetRoomEngine, GetRoomSession } from '../../api';
import { Base, Flex } from '../../common';
import { ItemCountView } from '../../views/shared/item-count/ItemCountView';
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
                <Base pointer className="navigation-item icon icon-me-helper-tool" onClick={ () => handleToolbarItemClick(ToolbarViewItems.GUIDE_TOOL_ITEM) } /> }
            <Base pointer className="navigation-item icon icon-me-achievements" onClick={ () => handleToolbarItemClick(ToolbarViewItems.ACHIEVEMENTS_ITEM) }>
                { (unseenAchievementCount > 0) &&
                    <ItemCountView count={ unseenAchievementCount } /> }
            </Base>
            <Base pointer className="navigation-item icon icon-me-profile" onClick={ () => handleToolbarItemClick(ToolbarViewItems.PROFILE_ITEM) } />
            <Base pointer className="navigation-item icon icon-me-rooms" />
            <Base pointer className="navigation-item icon icon-me-clothing" onClick={ () => handleToolbarItemClick(ToolbarViewItems.CLOTHING_ITEM) } />
            <Base pointer className="navigation-item icon icon-me-settings" onClick={ () => handleToolbarItemClick(ToolbarViewItems.SETTINGS_ITEM) } />
        </Flex>
    );
}
