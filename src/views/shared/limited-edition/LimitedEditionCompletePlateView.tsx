import { FC, useMemo } from 'react';
import { LocalizeText } from '../../../api';
import { Base, BaseProps } from '../../../common/Base';
import { Column } from '../../../common/Column';
import { Flex } from '../../../common/Flex';
import { LimitedEditionStyledNumberView } from './LimitedEditionStyledNumberView';

export interface LimitedEditionCompletePlateViewProps extends BaseProps<HTMLDivElement>
{
    uniqueLimitedItemsLeft: number;
    uniqueLimitedSeriesSize: number;
}

export const LimitedEditionCompletePlateView: FC<LimitedEditionCompletePlateViewProps> = props =>
{
    const { uniqueLimitedItemsLeft = 0, uniqueLimitedSeriesSize = 0, classNames = [], ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'unique-complete-plate' ];

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ classNames ]);

    return (
        <Base classNames={ getClassNames } { ...rest }>
            <Column className="plate-container" gap={ 0 }>
                <Flex justifyContent="between" alignItems="center">
                    { LocalizeText('unique.items.left') }
                    <LimitedEditionStyledNumberView value={ uniqueLimitedItemsLeft } />
                </Flex>
                <Flex justifyContent="between" alignItems="center">
                    { LocalizeText('unique.items.number.sold') }
                    <LimitedEditionStyledNumberView value={ uniqueLimitedSeriesSize } />
                </Flex>
            </Column>
        </Base>
    );
}
