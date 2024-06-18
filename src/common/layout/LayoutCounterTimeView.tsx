import { FC, useMemo } from 'react';
import { LocalizeText } from '../../api';
import { Base, BaseProps } from '../Base';

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
        <div className="flex gap-1 top-2 end-2">
            <Base classNames={ getClassNames } { ...rest }>
                <div>{ day != '00' ? day : hour }{ day != '00' ? LocalizeText('countdown_clock_unit_days') : LocalizeText('countdown_clock_unit_hours') }</div>
            </Base>
            <div style={ { marginTop: '3px' } }>:</div>
            <Base className="nitro-counter-time" { ...rest }>
                <div>{ minutes }{ LocalizeText('countdown_clock_unit_minutes') }</div>
            </Base>
            <Base style={ { marginTop: '3px' } }>:</Base>
            <Base className="nitro-counter-time" { ...rest }>
                <div>{ seconds }{ LocalizeText('countdown_clock_unit_seconds') }</div>
            </Base>
            { children }
        </div>
    );
};
