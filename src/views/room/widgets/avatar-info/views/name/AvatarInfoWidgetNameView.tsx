import { FC, useMemo } from 'react';
import { GetSessionDataManager } from '../../../../../../api';
import { ContextMenuView } from '../../../context-menu/ContextMenuView';
import { ContextMenuHeaderView } from '../../../context-menu/views/header/ContextMenuHeaderView';
import { AvatarInfoWidgetNameViewProps } from './AvatarInfoWidgetNameView.types';

export const AvatarInfoWidgetNameView: FC<AvatarInfoWidgetNameViewProps> = props =>
{
    const { nameData = null, close = null } = props;

    const fades = useMemo(() =>
    {
        return (nameData.id !== GetSessionDataManager().userId);
    }, [ nameData ]);

    return (
        <ContextMenuView objectId={ nameData.roomIndex } category={ nameData.category } fades={ fades } close= { close }>
            <ContextMenuHeaderView>
                { nameData.name }
            </ContextMenuHeaderView>
        </ContextMenuView>
    );
}
