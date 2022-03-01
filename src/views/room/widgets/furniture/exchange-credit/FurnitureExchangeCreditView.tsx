import { FC, useCallback, useState } from 'react';
import { LocalizeText, RoomWidgetCreditFurniRedeemMessage, RoomWidgetUpdateCreditFurniEvent } from '../../../../../api';
import { Base, Button, Column, Flex, Text } from '../../../../../common';
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
        BatchUpdates(() =>
        {
            setObjectId(event.objectId);
            setValue(event.value);
        });
    }, []);

    CreateEventDispatcherHook(RoomWidgetUpdateCreditFurniEvent.CREDIT_FURNI_UPDATE, eventDispatcher, onRoomWidgetUpdateCreditFurniEvent);

    const close = () =>
    {
        BatchUpdates(() =>
        {
            setObjectId(-1);
            setValue(0);
        });
    }

    const redeem = () =>
    {
        widgetHandler.processWidgetMessage(new RoomWidgetCreditFurniRedeemMessage(RoomWidgetCreditFurniRedeemMessage.REDEEM, objectId));

        close();
    }

    if(objectId === -1) return null;

    return (
        <NitroCardView className="nitro-widget-exchange-credit" simple>
            <NitroCardHeaderView headerText={ LocalizeText('catalog.redeem.dialog.title') } onCloseClick={ close } />
            <NitroCardContentView center>
                <Flex overflow="hidden" gap={ 2 }>
                    <Column center>
                        <Base className="exchange-image" />
                    </Column>
                    <Column grow justifyContent="between" overflow="hidden">
                        <Column gap={ 1 } overflow="auto">
                            <Text fontWeight="bold">{ LocalizeText('creditfurni.description', [ 'credits' ], [ value.toString() ]) }</Text>
                            <Text>{ LocalizeText('creditfurni.prompt') }</Text>
                        </Column>
                        <Button variant="success" onClick={ redeem }>
                            { LocalizeText('catalog.redeem.dialog.button.exchange') }
                        </Button>
                    </Column>
                </Flex>
            </NitroCardContentView>
        </NitroCardView>
    );
}
