import { FC, useCallback, useState } from 'react';
import { LocalizeText, RoomWidgetCreditFurniRedeemMessage, RoomWidgetUpdateCreditFurniEvent } from '../../../../../api';
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

    const processAction = useCallback((type: string, value: string = null) =>
    {
        switch(type)
        {
            case 'close':
                BatchUpdates(() =>
                {
                    setObjectId(-1);
                    setValue(0);
                });
                return;
            case 'redeem':
                widgetHandler.processWidgetMessage(new RoomWidgetCreditFurniRedeemMessage(RoomWidgetCreditFurniRedeemMessage.REDEEM, objectId));

                processAction('close');
                return;
        }
    }, [ widgetHandler, objectId ]);

    if(objectId === -1) return null;

    return (
        <NitroCardView className="nitro-exchange-credit" simple={ true }>
            <NitroCardHeaderView headerText={ LocalizeText('catalog.redeem.dialog.title') } onCloseClick={ event => processAction('close') } />
            <NitroCardContentView>
                <div className="text-black mb-2">
                    { LocalizeText('widgets.furniture.credit.redeem.value', [ 'value' ], [ value.toString() ]) }
                </div>
                <button className="btn btn-success w-100" onClick={ event => processAction('redeem') }>{ LocalizeText('catalog.redeem.dialog.button.exchange') }</button>
            </NitroCardContentView>
        </NitroCardView>
    );
}
