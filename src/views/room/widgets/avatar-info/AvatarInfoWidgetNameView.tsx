import { FC, useMemo } from 'react';
import { GetSessionDataManager, RoomWidgetObjectNameEvent } from '../../../../api';
import { ContextMenuView } from '../context-menu/ContextMenuView';

interface AvatarInfoWidgetNameViewProps
{
    nameData: RoomWidgetObjectNameEvent;
    close: () => void;
}

export const AvatarInfoWidgetNameView: FC<AvatarInfoWidgetNameViewProps> = props =>
{
    const { nameData = null, close = null } = props;

    const fades = useMemo(() => (nameData.id !== GetSessionDataManager().userId), [ nameData ]);

    return (
        <ContextMenuView objectId={ nameData.roomIndex } category={ nameData.category } userType={ nameData.userType } fades={ fades } className="name-only" close= { close }>
            <div className="text-shadow">
                { nameData.name }
            </div>
        </ContextMenuView>
    );
}
