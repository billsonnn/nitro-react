import { BadgePointLimitsEvent, ILinkEventTracker, IRoomSession, RoomEngineObjectEvent, RoomEngineObjectPlacedEvent, RoomPreviewer, RoomSessionEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { AddEventLinkTracker, GetLocalization, GetRoomEngine, LocalizeText, RemoveLinkEventTracker, UnseenItemCategory } from '../../api';
import { isObjectMoverRequested, setObjectMoverRequested } from '../../api/inventory/InventoryUtilities';
import { NitroCardContentView, NitroCardHeaderView, NitroCardTabsItemView, NitroCardTabsView, NitroCardView } from '../../common';
import { UseMessageEventHook, UseRoomEngineEvent, UseRoomSessionManagerEvent, useSharedInventoryTrade, useSharedInventoryUnseenTracker } from '../../hooks';
import { InventoryBadgeView } from './views/InventoryBadgeView';
import { InventoryBotView } from './views/InventoryBotView';
import { InventoryFurnitureView } from './views/InventoryFurnitureView';
import { InventoryPetView } from './views/InventoryPetView';
import { InventoryTradeView } from './views/InventoryTradeView';

const TAB_FURNITURE: string = 'inventory.furni';
const TAB_BOTS: string = 'inventory.bots';
const TAB_PETS: string = 'inventory.furni.tab.pets';
const TAB_BADGES: string = 'inventory.badges';
const TABS = [ TAB_FURNITURE, TAB_BOTS, TAB_PETS, TAB_BADGES ];
const UNSEEN_CATEGORIES = [ UnseenItemCategory.FURNI, UnseenItemCategory.BOT, UnseenItemCategory.PET, UnseenItemCategory.BADGE ];

export const InventoryView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ]   = useState(false);
    const [ currentTab, setCurrentTab ] = useState<string>(TABS[0]);
    const [ roomSession, setRoomSession ] = useState<IRoomSession>(null);
    const [ roomPreviewer, setRoomPreviewer ] = useState<RoomPreviewer>(null);
    const { isTrading = false, stopTrading = null } = useSharedInventoryTrade();
    const { getCount = null, resetCategory = null } = useSharedInventoryUnseenTracker();

    const close = () =>
    {
        if(isTrading) stopTrading();

        setIsVisible(false);
    }

    const onRoomEngineObjectPlacedEvent = useCallback((event: RoomEngineObjectPlacedEvent) =>
    {
        if(!isObjectMoverRequested()) return;

        setObjectMoverRequested(false);

        if(!event.placedInRoom) setIsVisible(true);
    }, []);

    UseRoomEngineEvent(RoomEngineObjectEvent.PLACED, onRoomEngineObjectPlacedEvent);

    const onRoomSessionEvent = useCallback((event: RoomSessionEvent) =>
    {
        switch(event.type)
        {
            case RoomSessionEvent.CREATED:
                setRoomSession(event.session);
                return;
            case RoomSessionEvent.ENDED:
                setRoomSession(null);
                setIsVisible(false);
                return;
        }
    }, []);

    UseRoomSessionManagerEvent(RoomSessionEvent.CREATED, onRoomSessionEvent);
    UseRoomSessionManagerEvent(RoomSessionEvent.ENDED, onRoomSessionEvent);

    const onBadgePointLimitsEvent = useCallback((event: BadgePointLimitsEvent) =>
    {
        const parser = event.getParser();

        for(const data of parser.data) GetLocalization().setBadgePointLimit(data.badgeId, data.limit);
    }, []);

    UseMessageEventHook(BadgePointLimitsEvent, onBadgePointLimitsEvent);

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived: (url: string) =>
            {
                const parts = url.split('/');

                if(parts.length < 2) return;
        
                switch(parts[1])
                {
                    case 'show':
                        setIsVisible(true);
                        return;
                    case 'hide':
                        setIsVisible(false);
                        return;
                    case 'toggle':
                        setIsVisible(prevValue => !prevValue);
                        return;
                }
            },
            eventUrlPrefix: 'inventory/'
        };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, []);

    useEffect(() =>
    {
        setRoomPreviewer(new RoomPreviewer(GetRoomEngine(), ++RoomPreviewer.PREVIEW_COUNTER));

        return () =>
        {
            setRoomPreviewer(prevValue =>
                {
                    prevValue.dispose();

                    return null;
                });
        }
    }, []);

    useEffect(() =>
    {
        if(!isVisible && isTrading) setIsVisible(true);
    }, [ isVisible, isTrading ]);

    if(!isVisible) return null;

    return (
        <NitroCardView uniqueKey={'inventory'} className="nitro-inventory" theme={ isTrading ? 'primary-slim' : '' } >
            <NitroCardHeaderView headerText={ LocalizeText('inventory.title') } onCloseClick={ close } />
            { !isTrading &&
                <>
                    <NitroCardTabsView>
                        { TABS.map((name, index) =>
                            {
                                const unseenCount = getCount(UNSEEN_CATEGORIES[index]);

                                return (
                                    <NitroCardTabsItemView key={ index } isActive={ (currentTab === name) } onClick={ event => setCurrentTab(name) } count={ unseenCount }>
                                        { LocalizeText(name) }
                                    </NitroCardTabsItemView>
                                );
                            }) }
                    </NitroCardTabsView>
                    <NitroCardContentView>
                        { (currentTab === TAB_FURNITURE ) &&
                            <InventoryFurnitureView roomSession={ roomSession } roomPreviewer={ roomPreviewer } /> }
                        { (currentTab === TAB_BOTS ) &&
                            <InventoryBotView roomSession={ roomSession } roomPreviewer={ roomPreviewer } /> }
                        { (currentTab === TAB_PETS ) && 
                            <InventoryPetView roomSession={ roomSession } roomPreviewer={ roomPreviewer } /> }
                        { (currentTab === TAB_BADGES ) && 
                            <InventoryBadgeView /> }
                    </NitroCardContentView>
                </> }
            { isTrading &&
                <NitroCardContentView>
                    <InventoryTradeView cancelTrade={ close } />
                </NitroCardContentView> }
        </NitroCardView>
    );
}
