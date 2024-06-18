import { FC } from 'react';
import { GetRendererVersion, GetUIVersion, NotificationAlertItem } from '../../../../api';
import { Button, Column, Grid, LayoutNotificationAlertView, LayoutNotificationAlertViewProps, Text } from '../../../../common';

interface NotificationDefaultAlertViewProps extends LayoutNotificationAlertViewProps
{
    item: NotificationAlertItem;
}

export const NitroSystemAlertView: FC<NotificationDefaultAlertViewProps> = props =>
{
    const { title = 'Nitro', onClose = null, ...rest } = props;

    return (
        <LayoutNotificationAlertView title={ title } onClose={ onClose } { ...rest }>
            <Grid>
                <Column center size={ 5 }>
                    <object data="https://assets.nitrodev.co/logos/nitro-n-dark.svg" height="100" width="100">&nbsp;</object>
                </Column>
                <Column size={ 7 }>
                    <Column alignItems="center" gap={ 0 }>
                        <Text bold fontSize={ 4 }>Nitro React</Text>
                        <Text>v{ GetUIVersion() }</Text>
                    </Column>
                    <Column alignItems="center">
                        <Text><b>Renderer:</b> v{ GetRendererVersion() }</Text>
                        <Column fullWidth gap={ 1 }>
                            <Button fullWidth variant="success" onClick={ event => window.open('https://discord.nitrodev.co') }>Discord</Button>
                            <div className="flex gap-1">
                                <Button fullWidth onClick={ event => window.open('https://git.krews.org/nitro/nitro-react') }>Git</Button>
                                <Button fullWidth onClick={ event => window.open('https://git.krews.org/nitro/nitro-react/-/issues') }>Bug Report</Button>
                            </div>
                        </Column>
                    </Column>
                </Column>
            </Grid>
        </LayoutNotificationAlertView>
    );
};
