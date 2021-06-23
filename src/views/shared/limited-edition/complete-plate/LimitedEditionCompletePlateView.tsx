import { FC } from 'react';
import { LocalizeText } from '../../../../utils/LocalizeText';
import { LimitedEditionStyledNumberView } from '../styled-number/LimitedEditionStyledNumberView';
import { LimitedEditionCompletePlateViewProps } from './LimitedEditionCompletePlateView.types';

export const LimitedEditionCompletePlateView: FC<LimitedEditionCompletePlateViewProps> = props =>
{
    const { uniqueLimitedItemsLeft = 0, uniqueLimitedSeriesSize = 0 } = props;

    return (
        <div className="unique-complete-plate mt-1 mx-auto" style={ { zIndex: 1 } }>
            <div>
                <div>
                    <LimitedEditionStyledNumberView value={ uniqueLimitedItemsLeft } />
                </div>
                { LocalizeText('unique.items.left') }
            </div>
            <div>
                <div>
                    <LimitedEditionStyledNumberView value={ uniqueLimitedSeriesSize } />
                </div>
                { LocalizeText('unique.items.number.sold') }
            </div>
        </div>
    );
}
