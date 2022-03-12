import { FC, useMemo } from 'react';
import { Base, BaseProps } from '../../Base';
import { LayoutLimitedEditionStyledNumberView } from './LayoutLimitedEditionStyledNumberView';

interface LayoutLimitedEditionCompactPlateViewProps extends BaseProps<HTMLDivElement>
{
    uniqueNumber: number;
    uniqueSeries: number;
}

export const LayoutLimitedEditionCompactPlateView: FC<LayoutLimitedEditionCompactPlateViewProps> = props =>
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
                <LayoutLimitedEditionStyledNumberView value={ uniqueNumber } />
            </div>
            <div>
                <LayoutLimitedEditionStyledNumberView value={ uniqueSeries } />
            </div>
            { children }
        </Base>
    );
}
