import { FC, useMemo } from 'react';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView, NitroCardViewProps } from '../card';

export interface LayoutNotificationAlertViewProps extends NitroCardViewProps
{
    title?: string;
    close: () => void;
}

export const LayoutNotificationAlertView: FC<LayoutNotificationAlertViewProps> = props =>
{
    const { title = '', close = null, classNames = [], children = null, ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'nitro-alert' ];

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ classNames ]);

    return (
        <NitroCardView classNames={ getClassNames } theme="primary-slim" { ...rest }>
            <NitroCardHeaderView headerText={ title } onCloseClick={ close } />
            <NitroCardContentView grow justifyContent="between" overflow="hidden" className="text-black">
                { children }
            </NitroCardContentView>
        </NitroCardView>
    );
}
