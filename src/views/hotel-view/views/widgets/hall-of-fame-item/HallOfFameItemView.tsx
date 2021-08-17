import { FC } from 'react';
import { LocalizeText } from '../../../../../api';
import { AvatarImageView } from '../../../../shared/avatar-image/AvatarImageView';
import { HallOfFameItemViewProps } from './HallOfFameItemView.types';

export const HallOfFameItemView: FC<HallOfFameItemViewProps> = props =>
{
    const { data = null, level = 0 } = props;

    return (
        <div className="hof-user-container cursor-pointer">
            <div className="hof-tooltip">
                <div className="hof-tooltip-content">
                    <div className="fw-bold">{ level }. { data.userName }</div>
                    <div className="muted fst-italic small text-center">{ LocalizeText('landing.view.competition.hof.points', [ 'points' ], [ data.currentScore.toString() ])}</div>
                </div>
            </div>
            <AvatarImageView figure={ data.figure } direction={ 2 } />
        </div>
    );
}
