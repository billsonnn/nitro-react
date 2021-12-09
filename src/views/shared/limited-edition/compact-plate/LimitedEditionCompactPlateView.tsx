import { FC, useMemo } from 'react';
import { Base } from '../../../../common/Base';
import { LimitedEditionStyledNumberView } from '../styled-number/LimitedEditionStyledNumberView';
import { LimitedEditionCompactPlateViewProps } from './LimitedEditionCompactPlateView.types';

export const LimitedEditionCompactPlateView: FC<LimitedEditionCompactPlateViewProps> = props =>
{
    const { uniqueNumber = 0, uniqueSeries = 0, classNames = [], children = null, ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'unique-compact-plate', 'z-index-1' ];

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ classNames ]);

    return (
        <Base classNames={ getClassNames } { ...rest }>
            <div>
                <LimitedEditionStyledNumberView value={ uniqueNumber } />
            </div>
            <div>
                <LimitedEditionStyledNumberView value={ uniqueSeries } />
            </div>
            { children }
        </Base>
    );
}
