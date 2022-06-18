import { GetRoomAdPurchaseInfoComposer, PurchaseRoomAdMessageComposer, RoomAdPurchaseInfoEvent, RoomEntryData } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { LocalizeText, SendMessageComposer } from '../../../../../api';
import { Base, Column, Text } from '../../../../../common';
import { UseMessageEventHook } from '../../../../../hooks';
import { CatalogLayoutProps } from './CatalogLayout.types';

export const CatalogLayoutRoomAdsView: FC<CatalogLayoutProps> = props =>
{
    const { page = null } = props;
    const [ eventName, setEventName ] = useState<string>('');
    const [ eventDesc, setEventDesc ] = useState<string>('');
    const [ roomId, setRoomId ] = useState<number>(null);
    const [ availableRooms, setAvailableRooms ] = useState<RoomEntryData[]>([]);
    const [ extended, setExtended ] = useState<boolean>(false);
    const [ categories, setCategories ] = useState(null);

    const onRoomAdPurchaseInfoEvent = useCallback((event: RoomAdPurchaseInfoEvent) =>
    {
        const parser = event.getParser();

        if(!parser) return;

        setAvailableRooms(parser.rooms);
    }, []);
    
    UseMessageEventHook(RoomAdPurchaseInfoEvent, onRoomAdPurchaseInfoEvent);

    const purchaseAd = useCallback(() =>
    {
        const pageId = page.pageId;
        const offerId = page.offers.length >= 1 ? page.offers[0].offerId : -1;
        const flatId = roomId;
        const name = eventName;
        const desc = eventDesc;
        const categoryId = -1;

        SendMessageComposer(new PurchaseRoomAdMessageComposer(pageId, offerId, flatId, name, extended, desc, categoryId))
    }, [eventDesc, eventName, extended, page.offers, page.pageId, roomId]);

    useEffect(() =>
    {
        SendMessageComposer(new GetRoomAdPurchaseInfoComposer());
        //SendMessageComposer(new GetUserEventCatsMessageComposer());
    }, []);

    return (<>
        <Text bold center>{LocalizeText('roomad.catalog_header')}</Text>
        <Column size={12} overflow="hidden" className='text-black'>
            <Base>{LocalizeText('roomad.catalog_text')}</Base>
            <Base className='bg-muted rounded p-1'>
                <Column gap={ 1 }>
                    <Text bold>{ LocalizeText('roomad.catalog_name') }</Text>
                    <input type="text" className="form-control form-control-sm" maxLength={ 64 } value={ eventName } onChange={ event => setEventName(event.target.value) } />
                </Column>
                <Column gap={ 1 }>
                <   Text bold>{LocalizeText('roomad.catalog_description')}</Text>
                    <textarea className='form-control form-control-sm' maxLength={ 64 } value={ eventDesc } onChange={ event => setEventDesc(event.target.value) }/>
                </Column>
                <Column gap={ 1 }>
                    <Text bold>{ LocalizeText('roomad.catalog_roomname') }</Text>
                    <select className="form-select form-select-sm" value={ roomId } onChange={ event => setRoomId(parseInt(event.target.value)) }>
                        <option value={ -1 } disabled>{ LocalizeText('roomad.catalog_roomname') }</option>
                        { availableRooms && availableRooms.map((room, index) => <option key={ index } value={ room.roomId }>{ room.roomName }</option>) }
                    </select>
                </Column>
            </Base>
        </Column>
        </>
    );
}
