import { FC } from 'react';
import { NotificationCenterView } from '../notification-center/NotificationCenterView';
import { PurseView } from '../purse/PurseView';
import { RightSideProps } from './RightSideView.types';

export const RightSideView: FC<RightSideProps> = props =>
{
    return (
        <div className="nitro-right-side">
            <div className="position-relative d-flex flex-column">
                <PurseView />
                <NotificationCenterView />
            </div>
        </div>
    );
}
