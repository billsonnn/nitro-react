import { FC, useMemo } from 'react';
import { LocalizeText } from '../../../api';
import { Base, BaseProps } from '../../Base';
import { Column } from '../../Column';
import { LayoutLimitedEditionStyledNumberView } from './LayoutLimitedEditionStyledNumberView';

interface LayoutLimitedEditionCompletePlateViewProps extends BaseProps<HTMLDivElement>
{
    uniqueLimitedItemsLeft: number;
    uniqueLimitedSeriesSize: number;
}

export const LayoutLimitedEditionCompletePlateView: FC<LayoutLimitedEditionCompletePlateViewProps> = props =>
{
    const { uniqueLimitedItemsLeft = 0, uniqueLimitedSeriesSize = 0, classNames = [], ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = ['unique-complete-plate'];

        if (classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [classNames]);

    return (
        <Base classNames={getClassNames} {...rest}>
            <Column className="plate-container" gap={0}>
                <div className="flex justify-between items-center">
                    {LocalizeText('unique.items.left')}
                    <div><LayoutLimitedEditionStyledNumberView value={uniqueLimitedItemsLeft} /></div>
                </div>
                <div className="flex justify-between items-center">
                    {LocalizeText('unique.items.number.sold')}
                    <div><LayoutLimitedEditionStyledNumberView value={uniqueLimitedSeriesSize} /></div>
                </div>
            </Column>
        </Base>
    );
}
