import { GetRoomAdPurchaseInfoComposer, GetUserEventCatsMessageComposer, PurchaseRoomAdMessageComposer, RoomAdPurchaseInfoEvent, RoomEntryData, UserEventCatsEvent } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { LocalizeText, SendMessageComposer } from '../../../../../api';
import { Base, Button, Column, Text } from '../../../../../common';
import { useMessageEvent } from '../../../../../hooks';
import { CatalogLayoutProps } from './CatalogLayout.types';

export const CatalogLayoutRoomAdsView: FC<CatalogLayoutProps> = props =>
{
    const { page = null } = props;
    const [ eventName, setEventName ] = useState<string>('');
    const [ eventDesc, setEventDesc ] = useState<string>('');
    const [ roomId, setRoomId ] = useState<number>(-1);
    const [ availableRooms, setAvailableRooms ] = useState<RoomEntryData[]>([]);
    const [ extended, setExtended ] = useState<boolean>(false);
    const [ categoryId, setCategoryId ] = useState<number>(1);
    const [ categories, setCategories ] = useState<INavigatorCategory[]>(null);

    const purchaseAd = () =>
    {
        const pageId = page.pageId;
        const offerId = page.offers.length >= 1 ? page.offers[0].offerId : -1;
        const flatId = roomId;
        const name = eventName;
        const desc = eventDesc;
        const catId = categoryId;

        SendMessageComposer(new PurchaseRoomAdMessageComposer(pageId, offerId, flatId, name, extended, desc, catId))
    }

    useMessageEvent<RoomAdPurchaseInfoEvent>(RoomAdPurchaseInfoEvent, event =>
    {
        const parser = event.getParser();

        if(!parser) return;

        setAvailableRooms(parser.rooms);
    });

    useMessageEvent<UserEventCatsEvent>(UserEventCatsEvent, event =>
    {
        const parser = event.getParser();

        setCategories(parser.categories);
    });

    useEffect(() =>
    {
        SendMessageComposer(new GetRoomAdPurchaseInfoComposer());
        // TODO: someone needs to fix this for morningstar
        SendMessageComposer(new GetUserEventCatsMessageComposer());
    }, []);

    return (<>
        <Text bold center>{ LocalizeText('roomad.catalog_header') }</Text>
        <Column size={ 12 } overflow="hidden" className="text-black">
            <Base>{ LocalizeText('roomad.catalog_text') }</Base>
            <Base className="bg-muted rounded p-1">
                <Column gap={ 2 }>
                    <select className="form-select form-select-sm" value={ categoryId } onChange={ event => setCategoryId(parseInt(event.target.value)) }>
                        { categories && categories.map((cat, index) => <option key={ index } value={ cat.id }>{ cat.name }</option>) }
                    </select>
                </Column>
                <Column gap={ 1 }>
                    <Text bold>{ LocalizeText('roomad.catalog_name') }</Text>
                    <input type="text" className="form-control form-control-sm" maxLength={ 64 } value={ eventName } onChange={ event => setEventName(event.target.value) } />
                </Column>
                <Column gap={ 1 }>
                    < Text bold>{ LocalizeText('roomad.catalog_description') }</Text>
                    <textarea className="form-control form-control-sm" maxLength={ 64 } value={ eventDesc } onChange={ event => setEventDesc(event.target.value) }/>
                </Column>
                <Column gap={ 1 }>
                    <Text bold>{ LocalizeText('roomad.catalog_roomname') }</Text>
                    <select className="form-select form-select-sm" value={ roomId } onChange={ event => setRoomId(parseInt(event.target.value)) }>
                        <option value={ -1 } disabled>{ LocalizeText('roomad.catalog_roomname') }</option>
                        { availableRooms && availableRooms.map((room, index) => <option key={ index } value={ room.roomId }>{ room.roomName }</option>) }
                    </select>
                </Column>
                <Column gap={ 1 }>
                    <Button onClick={ purchaseAd }>{ LocalizeText('buy') }</Button>
                </Column>
            </Base>
        </Column>
    </>
    );
}

interface INavigatorCategory {
    id: number;
    name: string;
    visible: boolean;
}
