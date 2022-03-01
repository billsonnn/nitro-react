import { RoomObjectCategory } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { LocalizeText, RoomWidgetUpdateDecorateModeEvent } from '../../../../api';
import { useRoomContext } from '../../context/RoomContext';
import { ContextMenuListItemView } from '../context-menu/ContextMenuListItemView';
import { ContextMenuListView } from '../context-menu/ContextMenuListView';
import { ContextMenuView } from '../context-menu/ContextMenuView';

interface AvatarInfoWidgetDecorateViewProps
{
    userId: number;
    userName: string;
    roomIndex: number;
}

export const AvatarInfoWidgetDecorateView: FC<AvatarInfoWidgetDecorateViewProps> = props =>
{
    const { userId = -1, userName = '', roomIndex = -1 } = props;
    const { eventDispatcher = null } = useRoomContext();

    const stopDecorating = () => eventDispatcher.dispatchEvent(new RoomWidgetUpdateDecorateModeEvent(false));
    
    return (
        <ContextMenuView objectId={ roomIndex } category={ RoomObjectCategory.UNIT } close={ null }>
            <ContextMenuListView>
                <ContextMenuListItemView onClick={ stopDecorating }>
                    { LocalizeText('widget.avatar.stop_decorating') }
                </ContextMenuListItemView>
            </ContextMenuListView>
        </ContextMenuView>
    )
}
