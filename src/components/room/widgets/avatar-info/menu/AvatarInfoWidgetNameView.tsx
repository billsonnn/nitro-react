import { GetSessionDataManager } from '@nitrots/nitro-renderer';
import { FC, useMemo } from 'react';
import { AvatarInfoName } from '../../../../../api';
import { ContextMenuView } from '../../context-menu/ContextMenuView';

interface AvatarInfoWidgetNameViewProps
{
    nameInfo: AvatarInfoName;
    onClose: () => void;
}

export const AvatarInfoWidgetNameView: FC<AvatarInfoWidgetNameViewProps> = props =>
{
    const { nameInfo = null, onClose = null } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'name-only' ];

        if(nameInfo.isFriend) newClassNames.push('is-friend');

        return newClassNames;
    }, [ nameInfo ]);

    return (
        <ContextMenuView category={ nameInfo.category } classNames={ getClassNames } fades={ (nameInfo.id !== GetSessionDataManager().userId) } objectId={ nameInfo.roomIndex } userType={ nameInfo.userType } onClose={ onClose }>
            <div className="text-shadow">
                { nameInfo.name }
            </div>
        </ContextMenuView>
    );
};
