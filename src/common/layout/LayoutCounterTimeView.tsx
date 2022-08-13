import { FC, useMemo } from 'react';
import { Base, BaseProps, Column, Flex, Text } from '..';
import { LocalizeText } from '../../api';

interface LayoutCounterTimeViewProps extends BaseProps<HTMLDivElement>
{
    day: string;
    hour: string;
    minutes: string;
    seconds: string;
}

export const LayoutCounterTimeView: FC<LayoutCounterTimeViewProps> = props =>
{
    const { day = '00', hour = '00', minutes = '00', seconds = '00', classNames = [], children = null, ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'nitro-counter-time' ];

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ classNames ]);

    return (
        <>
            <Column gap={ 1 }>
                <Flex gap={ 1 }>
                    <Column>
                        <Base classNames={ getClassNames } { ...rest }>
                            <div>{ day != '00' ? day : hour }</div>
                            { children }
                        </Base>
                        <Text variant="white" small truncate center={ true }>{ day != '00' ? LocalizeText('countdown_clock_unit_days') : LocalizeText('countdown_clock_unit_hours') }</Text>
                    </Column>
                    <Column>
                        <Base style={ { marginTop: '3px' } }>
                            :
                        </Base>
                    </Column>
                    <Column>
                        <Base classNames={ getClassNames } { ...rest }>
                            <div>{ minutes }</div>
                            { children }
                        </Base>
                        <Text variant="white" small truncate center={ true }>{ LocalizeText('countdown_clock_unit_minutes') }</Text>
                    </Column>
                    <Column>
                        <Base style={ { marginTop: '3px' } }>
                            :
                        </Base>
                    </Column>
                    <Column>
                        <Base classNames={ getClassNames } { ...rest }>
                            <div>{ seconds }</div>
                            { children }
                        </Base>
                        <Text variant="white" small truncate center={ true }>{ LocalizeText('countdown_clock_unit_seconds') }</Text>
                    </Column>
                </Flex>
            </Column>
        </>
    );
}
