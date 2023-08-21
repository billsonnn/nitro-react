import { FC, useMemo } from 'react';
import { AvatarInfoName, GetSessionDataManager, MessengerFriend } from '../../../../../api';
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
        switch(nameInfo.relationshipStatus)
        {
            case MessengerFriend.RELATIONSHIP_HEART:
                newClassNames.push('is-heart');
                break;
            case MessengerFriend.RELATIONSHIP_SMILE:
                newClassNames.push('is-smile');
                break;
            case MessengerFriend.RELATIONSHIP_BOBBA:
                newClassNames.push('is-bobba');
                break;
        }

        return newClassNames;
    }, [ nameInfo ]);

    return (
        <ContextMenuView objectId={ nameInfo.roomIndex } category={ nameInfo.category } userType={ nameInfo.userType } fades={ (nameInfo.id !== GetSessionDataManager().userId) } classNames={ getClassNames } onClose={ onClose }>
            <div className="relation-icon"></div>
            <div className="text-shadow">
                { nameInfo.name }
            </div>
        </ContextMenuView>
    );
}
