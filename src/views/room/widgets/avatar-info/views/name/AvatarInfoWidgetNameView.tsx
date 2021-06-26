import { FC, useMemo } from 'react';
import { GetSessionDataManager } from '../../../../../../api';
import { ContextMenuView } from '../../../context-menu/ContextMenuView';
import { AvatarInfoWidgetNameViewProps } from './AvatarInfoWidgetNameView.types';

export const AvatarInfoWidgetNameView: FC<AvatarInfoWidgetNameViewProps> = props =>
{
    const { nameData = null, close = null } = props;

    const fades = useMemo(() =>
    {
        return (nameData.id !== GetSessionDataManager().userId);
    }, [ nameData ]);

    return (
        <ContextMenuView objectId={ nameData.roomIndex } category={ nameData.category } fades={ fades } className="name-only" close= { close }>
            <div className="text-shadow">
                { nameData.name }
            </div>
        </ContextMenuView>
    );
}
