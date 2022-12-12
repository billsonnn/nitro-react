import { FC } from 'react';
import { Column } from '../../common';
import { GroupRoomInformationView } from '../groups/views/GroupRoomInformationView';
import { NotificationCenterView } from '../notification-center/NotificationCenterView';
import { PurseView } from '../purse/PurseView';
import { MysteryBoxExtensionView } from '../room/widgets/mysterybox/MysteryBoxExtensionView';

export const RightSideView: FC<{}> = props =>
{
    return (
        <div className="nitro-right-side">
            <Column position="relative" gap={ 1 }>
                <PurseView />
                <GroupRoomInformationView />
                <MysteryBoxExtensionView />
                <NotificationCenterView />
            </Column>
        </div>
    );
}
