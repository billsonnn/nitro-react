import { FC } from 'react';
import { LocalizeFormattedNumber, LocalizeText } from '../../../../../api';
import { LayoutAvatarImageView, UserProfileIconView } from '../../../../../common';
import { HallOfFameItemViewProps } from './HallOfFameItemView.types';

export const HallOfFameItemView: FC<HallOfFameItemViewProps> = props =>
{
    const { data = null, level = 0 } = props;

    return (
        <div className="hof-user-container">
            <div className="hof-tooltip">
                <div className="hof-header">
                { level }. { data.userName } <UserProfileIconView userId={ data.userId } />
                </div>
                <div className="small text-center text-white">{ LocalizeText('landing.view.competition.hof.points', [ 'points' ], [ LocalizeFormattedNumber(data.currentScore).toString() ])}</div>
            </div>
            <LayoutAvatarImageView figure={ data.figure } direction={ 2 } />
        </div>
    );
}
