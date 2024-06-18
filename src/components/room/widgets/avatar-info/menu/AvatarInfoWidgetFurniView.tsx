import { RoomControllerLevel, RoomObjectOperationType } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { FaArrowsAlt, FaSyncAlt, FaTrashRestore } from 'react-icons/fa';
import { AvatarInfoFurni, ProcessRoomObjectOperation } from '../../../../../api';
import { ContextMenuHeaderView } from '../../context-menu/ContextMenuHeaderView';
import { ContextMenuListItemView } from '../../context-menu/ContextMenuListItemView';
import { ContextMenuView } from '../../context-menu/ContextMenuView';

interface AvatarInfoWidgetFurniViewProps
{
    avatarInfo: AvatarInfoFurni;
    onClose: () => void;
}

export const AvatarInfoWidgetFurniView: FC<AvatarInfoWidgetFurniViewProps> = props =>
{
    const { avatarInfo = null, onClose = null } = props;

    const processAction = (name: string) =>
    {
        let hideMenu = true;

        if(name)
        {
            switch(name)
            {
                case 'move':
                    ProcessRoomObjectOperation(avatarInfo.id, avatarInfo.category, RoomObjectOperationType.OBJECT_MOVE);
                    break;
                case 'rotate':
                    ProcessRoomObjectOperation(avatarInfo.id, avatarInfo.category, RoomObjectOperationType.OBJECT_ROTATE_POSITIVE);
                    break;
                case 'pickup':
                    ProcessRoomObjectOperation(avatarInfo.id, avatarInfo.category, RoomObjectOperationType.OBJECT_PICKUP);
                    break;
                case 'eject':
                    ProcessRoomObjectOperation(avatarInfo.id, avatarInfo.category, RoomObjectOperationType.OBJECT_EJECT);
                    break;
            }
        }
    };

    return (
        <ContextMenuView category={ avatarInfo.category } collapsable={ true } objectId={ avatarInfo.id } onClose={ onClose }>
            <ContextMenuHeaderView>
                { avatarInfo.name }
            </ContextMenuHeaderView>
            <div className="flex menu-list-split-3">
                <ContextMenuListItemView onClick={ event => processAction('move') }>
                    <FaArrowsAlt className="center fa-icon" />
                </ContextMenuListItemView>
                <ContextMenuListItemView disabled={ avatarInfo.isWallItem } onClick={ event => processAction('rotate') }>
                    <FaSyncAlt className="center fa-icon" />
                </ContextMenuListItemView>
                { (avatarInfo.isOwner || avatarInfo.isAnyRoomController) &&
                    <ContextMenuListItemView onClick={ event => processAction('pickup') }>
                        <FaTrashRestore className="center fa-icon" />
                    </ContextMenuListItemView> }
                { (!avatarInfo.isOwner && !avatarInfo.isAnyRoomController) && (avatarInfo.isRoomOwner || (avatarInfo.roomControllerLevel >= RoomControllerLevel.GUILD_ADMIN)) &&
                    <ContextMenuListItemView onClick={ event => processAction('eject') }>
                        <FaTrashRestore className="center fa-icon" />
                    </ContextMenuListItemView> }
            </div>
        </ContextMenuView>
    );
};
