import { NitroCard } from '@layout/NitroCard';
import { AddLinkEventTracker, BadgePointLimitsEvent, GetLocalizationManager, GetRoomEngine, ILinkEventTracker, IRoomSession, RemoveLinkEventTracker, RoomEngineObjectEvent, RoomEngineObjectPlacedEvent, RoomPreviewer, RoomSessionEvent } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { LocalizeText, UnseenItemCategory, isObjectMoverRequested, setObjectMoverRequested } from '../../api';
import { useInventoryTrade, useInventoryUnseenTracker, useMessageEvent, useNitroEvent } from '../../hooks';
import { InventoryBadgeView } from './views/badge/InventoryBadgeView';
import { InventoryBotView } from './views/bot/InventoryBotView';
import { InventoryFurnitureView } from './views/furniture/InventoryFurnitureView';
import { InventoryTradeView } from './views/furniture/InventoryTradeView';
import { InventoryPetView } from './views/pet/InventoryPetView';

const TAB_FURNITURE: string = 'inventory.furni';
const TAB_BOTS: string = 'inventory.bots';
const TAB_PETS: string = 'inventory.furni.tab.pets';
const TAB_BADGES: string = 'inventory.badges';
const TABS = [ TAB_FURNITURE, TAB_BOTS, TAB_PETS, TAB_BADGES ];
const UNSEEN_CATEGORIES = [ UnseenItemCategory.FURNI, UnseenItemCategory.BOT, UnseenItemCategory.PET, UnseenItemCategory.BADGE ];

export const InventoryView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const [ currentTab, setCurrentTab ] = useState<string>(TABS[0]);
    const [ roomSession, setRoomSession ] = useState<IRoomSession>(null);
    const [ roomPreviewer, setRoomPreviewer ] = useState<RoomPreviewer>(null);
    const { isTrading = false, stopTrading = null } = useInventoryTrade();
    const { getCount = null, resetCategory = null } = useInventoryUnseenTracker();

    const onClose = () =>
    {
        if(isTrading) stopTrading();

        setIsVisible(false);
    };

    useNitroEvent<RoomEngineObjectPlacedEvent>(RoomEngineObjectEvent.PLACED, event =>
    {
        if(!isObjectMoverRequested()) return;

        setObjectMoverRequested(false);

        if(!event.placedInRoom) setIsVisible(true);
    });

    useNitroEvent<RoomSessionEvent>([
        RoomSessionEvent.CREATED,
        RoomSessionEvent.ENDED
    ], event =>
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
    });

    useMessageEvent<BadgePointLimitsEvent>(BadgePointLimitsEvent, event =>
    {
        const parser = event.getParser();

        for(const data of parser.data) GetLocalizationManager().setBadgePointLimit(data.badgeId, data.limit);
    });

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

        AddLinkEventTracker(linkTracker);

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
        };
    }, []);

    useEffect(() =>
    {
        if(!isVisible && isTrading) setIsVisible(true);
    }, [ isVisible, isTrading ]);

    if(!isVisible) return null;

    return (
        <NitroCard
            className="w-inventory-w h-inventory-h min-w-inventory-w min-h-inventory-h"
            uniqueKey="inventory">
            <NitroCard.Header
                headerText={ LocalizeText('inventory.title') }
                onCloseClick={ onClose } />
            { !isTrading &&
                <>
                    <NitroCard.Tabs>
                        { TABS.map((name, index) =>
                        {
                            return (
                                <NitroCard.TabItem
                                    key={ index }
                                    count={ getCount(UNSEEN_CATEGORIES[index]) }
                                    isActive={ (currentTab === name) }
                                    onClick={ event => setCurrentTab(name) }>
                                    { LocalizeText(name) }
                                </NitroCard.TabItem>
                            );
                        }) }
                    </NitroCard.Tabs>
                    <NitroCard.Content>
                        { (currentTab === TAB_FURNITURE ) &&
                            <InventoryFurnitureView roomPreviewer={ roomPreviewer } roomSession={ roomSession } /> }
                        { (currentTab === TAB_BOTS ) &&
                            <InventoryBotView roomPreviewer={ roomPreviewer } roomSession={ roomSession } /> }
                        { (currentTab === TAB_PETS ) &&
                            <InventoryPetView roomPreviewer={ roomPreviewer } roomSession={ roomSession } /> }
                        { (currentTab === TAB_BADGES ) &&
                            <InventoryBadgeView /> }
                    </NitroCard.Content>
                </> }
            { isTrading &&
                <NitroCard.Content>
                    <InventoryTradeView cancelTrade={ onClose } />
                </NitroCard.Content> }
        </NitroCard>
    );
};
