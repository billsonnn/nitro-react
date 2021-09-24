import { RoomObjectCategory } from '@nitrots/nitro-renderer';
import { FC, useCallback } from 'react';
import { LocalizeText, RoomWidgetUpdateDecorateModeEvent } from '../../../../../../api';
import { useRoomContext } from '../../../../context/RoomContext';
import { ContextMenuView } from '../../../context-menu/ContextMenuView';
import { ContextMenuListItemView } from '../../../context-menu/views/list-item/ContextMenuListItemView';
import { ContextMenuListView } from '../../../context-menu/views/list/ContextMenuListView';
import { AvatarInfoWidgetDecorateViewProps } from './AvatarInfoWidgetDecorateView.types';

export const AvatarInfoWidgetDecorateView: FC<AvatarInfoWidgetDecorateViewProps> = props =>
{
    const { userId = -1, userName = '', roomIndex = -1 } = props;
    const { eventDispatcher = null } = useRoomContext();

    const stopDecorating = useCallback(() =>
    {
        eventDispatcher.dispatchEvent(new RoomWidgetUpdateDecorateModeEvent(false));
    }, [ eventDispatcher ]);
    
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
