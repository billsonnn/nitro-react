import { FC, useMemo } from 'react';
import { Base, BaseProps } from '../../../common/Base';
import { LimitedEditionStyledNumberView } from './LimitedEditionStyledNumberView';

export interface LimitedEditionCompactPlateViewProps extends BaseProps<HTMLDivElement>
{
    uniqueNumber: number;
    uniqueSeries: number;
}

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
