import { RoomObjectCategory } from 'nitro-renderer';
import { FC } from 'react';
import { LocalizeText } from '../../../../../../utils/LocalizeText';
import { ContextMenuView } from '../../../context-menu/ContextMenuView';
import { ContextMenuListItemView } from '../../../context-menu/views/list-item/ContextMenuListItemView';
import { ContextMenuListView } from '../../../context-menu/views/list/ContextMenuListView';
import { AvatarInfoWidgetDecorateViewProps } from './AvatarInfoWidgetDecorateView.types';

export const AvatarInfoWidgetDecorateView: FC<AvatarInfoWidgetDecorateViewProps> = props =>
{
    const { userId = -1, userName = '', roomIndex = -1, setIsDecorating = null } = props;
    
    return (
        <ContextMenuView objectId={ roomIndex } category={ RoomObjectCategory.UNIT } onClose={ null }>
            <ContextMenuListView>
                <ContextMenuListItemView onClick={ event => setIsDecorating(false) }>
                    { LocalizeText('widget.avatar.stop_decorating') }
                </ContextMenuListItemView>
            </ContextMenuListView>
        </ContextMenuView>
    )
}
