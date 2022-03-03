import { FC, useMemo } from 'react';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView, NitroCardViewProps } from '../card';

interface LayoutNotificationAlertViewProps extends NitroCardViewProps
{
    title: string;
    close: () => void;
}

export const LayoutNotificationAlertView: FC<LayoutNotificationAlertViewProps> = props =>
{
    const { title = '', close = null, simple = true, classNames = [], children = null, ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'nitro-alert' ];

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ classNames ]);

    return (
        <NitroCardView classNames={ getClassNames } simple={ simple } { ...rest }>
            <NitroCardHeaderView headerText={ title } onCloseClick={ close } />
            <NitroCardContentView justifyContent="between" className="text-black">
                { children }
            </NitroCardContentView>
        </NitroCardView>
    );
}
