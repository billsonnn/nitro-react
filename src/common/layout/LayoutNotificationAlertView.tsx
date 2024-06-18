import { FC, useMemo } from 'react';
import { NotificationAlertType } from '../../api';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView, NitroCardViewProps } from '../card';

export interface LayoutNotificationAlertViewProps extends NitroCardViewProps
{
    title?: string;
    type?: string;
    onClose: () => void;
}

export const LayoutNotificationAlertView: FC<LayoutNotificationAlertViewProps> = props =>
{
    const { title = '', onClose = null, classNames = [], children = null,type = NotificationAlertType.DEFAULT, ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'nitro-alert' ];

        newClassNames.push('nitro-alert-' + type);

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ classNames, type ]);

    return (
        <NitroCardView classNames={ getClassNames } theme="primary-slim" { ...rest }>
            <NitroCardHeaderView headerText={ title } onCloseClick={ onClose } />
            <NitroCardContentView grow className="text-black" gap={ 0 } justifyContent="between" overflow="hidden">
                { children }
            </NitroCardContentView>
        </NitroCardView>
    );
};
