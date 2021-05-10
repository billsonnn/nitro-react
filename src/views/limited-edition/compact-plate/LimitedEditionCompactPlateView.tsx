import { FC } from 'react';
import { LimitedEditionStyledNumberView } from '../styled-number/LimitedEditionStyledNumberView';
import { LimitedEditionCompactPlateViewProps } from './LimitedEditionCompactPlateView.types';

export const LimitedEditionCompactPlateView: FC<LimitedEditionCompactPlateViewProps> = props =>
{
    const { uniqueNumber = 0, uniqueSeries = 0 } = props;

    return (
        <div className="unique-compact-plate" style={ { zIndex: 1 } }>
            <div>
                <LimitedEditionStyledNumberView value={ uniqueNumber } />
            </div>
            <div>
                <LimitedEditionStyledNumberView value={ uniqueSeries } />
            </div>
        </div>
    );
}
