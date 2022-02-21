import { FC } from 'react';
import { GroupRoomInformationView } from '../../components/groups/views/room-information/GroupRoomInformationView';
import { PurseView } from '../../components/purse/PurseView';
import { NotificationCenterView } from '../notification-center/NotificationCenterView';
import { RightSideProps } from './RightSideView.types';

export const RightSideView: FC<RightSideProps> = props =>
{
    return (
        <div className="nitro-right-side">
            <div className="position-relative d-flex flex-column">
                <PurseView />
                <GroupRoomInformationView />
                <NotificationCenterView />
            </div>
        </div>
    );
}
