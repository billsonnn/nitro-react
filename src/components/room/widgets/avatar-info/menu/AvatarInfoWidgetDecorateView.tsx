import { RoomObjectCategory } from '@nitrots/nitro-renderer';
import { Dispatch, FC, SetStateAction } from 'react';
import { LocalizeText } from '../../../../../api';
import { ContextMenuListItemView } from '../../context-menu/ContextMenuListItemView';
import { ContextMenuListView } from '../../context-menu/ContextMenuListView';
import { ContextMenuView } from '../../context-menu/ContextMenuView';

interface AvatarInfoWidgetDecorateViewProps
{
    userId: number;
    userName: string;
    roomIndex: number;
    setIsDecorating: Dispatch<SetStateAction<boolean>>;
}

export const AvatarInfoWidgetDecorateView: FC<AvatarInfoWidgetDecorateViewProps> = props =>
{
    const { userId = -1, userName = '', roomIndex = -1, setIsDecorating = null } = props;

    return (
        <ContextMenuView category={ RoomObjectCategory.UNIT } objectId={ roomIndex } onClose={ null }>
            <ContextMenuListView>
                <ContextMenuListItemView onClick={ event => setIsDecorating(false) }>
                    { LocalizeText('widget.avatar.stop_decorating') }
                </ContextMenuListItemView>
            </ContextMenuListView>
        </ContextMenuView>
    );
};
