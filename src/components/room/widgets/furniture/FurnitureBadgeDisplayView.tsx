import { FC } from 'react';
import { LayoutTrophyView } from '../../../../common';
import { useFurnitureBadgeDisplayWidget } from '../../../../hooks';

export const FurnitureBadgeDisplayView: FC<{}> = props =>
{
    const { objectId = -1, color = '1', badgeName = '', badgeDesc = '', date = '', senderName = '', onClose = null } = useFurnitureBadgeDisplayWidget();

    if(objectId === -1) return null;

    return <LayoutTrophyView color={ color } message={ badgeDesc } date={ date } senderName={ senderName } customTitle={ badgeName } onCloseClick={ onClose } />;
}
