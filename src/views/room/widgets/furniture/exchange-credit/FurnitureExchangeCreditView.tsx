import { FC, useCallback, useState } from 'react';
import { LocalizeText, RoomWidgetCreditFurniRedeemMessage, RoomWidgetUpdateCreditFurniEvent } from '../../../../../api';
import { Base } from '../../../../../common/Base';
import { Button } from '../../../../../common/Button';
import { Column } from '../../../../../common/Column';
import { Grid } from '../../../../../common/Grid';
import { Text } from '../../../../../common/Text';
import { BatchUpdates } from '../../../../../hooks';
import { CreateEventDispatcherHook } from '../../../../../hooks/events/event-dispatcher.base';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../../layout';
import { useRoomContext } from '../../../context/RoomContext';

export const FurnitureExchangeCreditView: FC<{}> = props =>
{
    const [ objectId, setObjectId ] = useState(-1);
    const [ value, setValue ] = useState(0);
    const { eventDispatcher = null, widgetHandler = null } = useRoomContext();

    const onRoomWidgetUpdateCreditFurniEvent = useCallback((event: RoomWidgetUpdateCreditFurniEvent) =>
    {
        setObjectId(event.objectId);
        setValue(event.value);
    }, []);

    CreateEventDispatcherHook(RoomWidgetUpdateCreditFurniEvent.CREDIT_FURNI_UPDATE, eventDispatcher, onRoomWidgetUpdateCreditFurniEvent);

    const close = useCallback(() =>
    {
        BatchUpdates(() =>
        {
            setObjectId(-1);
            setValue(0);
        });
    }, []);

    const redeem = useCallback(() =>
    {
        widgetHandler.processWidgetMessage(new RoomWidgetCreditFurniRedeemMessage(RoomWidgetCreditFurniRedeemMessage.REDEEM, objectId));

        close();
    }, [ widgetHandler, objectId, close ]);

    if(objectId === -1) return null;

    return (
        <NitroCardView className="nitro-widget-exchange-credit" simple={ true }>
            <NitroCardHeaderView headerText={ LocalizeText('catalog.redeem.dialog.title') } onCloseClick={ close } />
            <NitroCardContentView>
                <Grid>
                    <Column center overflow="hidden" size={ 4 }>
                        <Base className="exchange-image" />
                    </Column>
                    <Column justifyContent="between" overflow="hidden" size={ 8 }>
                        <Column gap={ 1 } overflow="auto">
                            <Text fontWeight="bold">{ LocalizeText('creditfurni.description', [ 'credits' ], [ value.toString() ]) }</Text>
                            <Text>{ LocalizeText('creditfurni.prompt') }</Text>
                        </Column>
                        <Button variant="success" onClick={ redeem }>
                            { LocalizeText('catalog.redeem.dialog.button.exchange') }
                        </Button>
                    </Column>
                </Grid>
            </NitroCardContentView>
        </NitroCardView>
    );
}
