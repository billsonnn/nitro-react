import { FC } from 'react';
import { Column } from '../../common';
import { NotificationCenterView } from '../../views/notification-center/NotificationCenterView';
import { GroupRoomInformationView } from '../groups/views/GroupRoomInformationView';
import { PurseView } from '../purse/PurseView';

export const RightSideView: FC<{}> = props =>
{
    return (
        <div className="nitro-right-side">
            <Column position="relative" gap={ 1 }>
                <PurseView />
                <GroupRoomInformationView />
                <NotificationCenterView />
            </Column>
        </div>
    );
}
