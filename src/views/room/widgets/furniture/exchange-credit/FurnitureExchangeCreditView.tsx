import { FC, useCallback, useState } from 'react';
import { LocalizeText, RoomWidgetCreditFurniRedeemMessage, RoomWidgetUpdateCreditFurniEvent } from '../../../../../api';
import { BatchUpdates } from '../../../../../hooks';
import { CreateEventDispatcherHook } from '../../../../../hooks/events/event-dispatcher.base';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView, NitroLayoutButton, NitroLayoutFlexColumn, NitroLayoutGrid, NitroLayoutGridColumn } from '../../../../../layout';
import { NitroLayoutBase } from '../../../../../layout/base';
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
                <NitroLayoutGrid>
                    <NitroLayoutGridColumn className="justify-content-center align-items-center" overflow="hidden" size={ 4 }>
                        <NitroLayoutBase className="exchange-image" />
                    </NitroLayoutGridColumn>
                    <NitroLayoutGridColumn className="justify-content-between" overflow="hidden" size={ 8 }>
                        <NitroLayoutFlexColumn gap={ 1 } overflow="auto">
                            <NitroLayoutBase className="text-black fw-bold">
                                { LocalizeText('creditfurni.description', [ 'credits' ], [ value.toString() ]) }
                            </NitroLayoutBase>
                            <NitroLayoutBase className="text-black">
                                { LocalizeText('creditfurni.prompt') }
                            </NitroLayoutBase>
                        </NitroLayoutFlexColumn>
                        <NitroLayoutButton variant="success" onClick={ redeem }>
                            { LocalizeText('catalog.redeem.dialog.button.exchange') }
                        </NitroLayoutButton>
                    </NitroLayoutGridColumn>
                </NitroLayoutGrid>
            </NitroCardContentView>
        </NitroCardView>
    );
}
