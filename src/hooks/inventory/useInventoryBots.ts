import { BotAddedToInventoryEvent, BotData, BotInventoryMessageEvent, BotRemovedFromInventoryEvent, CreateLinkEvent, GetBotInventoryComposer } from '@nitrots/nitro-renderer';
import { useEffect, useState } from 'react';
import { useBetween } from 'use-between';
import { IBotItem, SendMessageComposer, UnseenItemCategory, cancelRoomObjectPlacement, getPlacingItemId } from '../../api';
import { useMessageEvent } from '../events';
import { useSharedVisibility } from '../useSharedVisibility';
import { useInventoryUnseenTracker } from './useInventoryUnseenTracker';

const useInventoryBotsState = () =>
{
    const [ needsUpdate, setNeedsUpdate ] = useState(true);
    const [ botItems, setBotItems ] = useState<IBotItem[]>([]);
    const [ selectedBot, setSelectedBot ] = useState<IBotItem>(null);
    const { isVisible = false, activate = null, deactivate = null } = useSharedVisibility();
    const { isUnseen = null, resetCategory = null } = useInventoryUnseenTracker();

    useMessageEvent<BotInventoryMessageEvent>(BotInventoryMessageEvent, event =>
    {
        const parser = event.getParser();

        setBotItems(prevValue =>
        {
            const newValue = [ ...prevValue ];
            const existingIds = newValue.map(item => item.botData.id);
            const addedDatas: BotData[] = [];

            for(const botData of parser.items.values()) ((existingIds.indexOf(botData.id) === -1) && addedDatas.push(botData));

            for(const existingId of existingIds)
            {
                let remove = true;

                for(const botData of parser.items.values())
                {
                    if(botData.id === existingId)
                    {
                        remove = false;

                        break;
                    }
                }

                if(!remove) continue;

                const index = newValue.findIndex(item => (item.botData.id === existingId));
                const botItem = newValue[index];

                if((index === -1) || !botItem) continue;

                if(getPlacingItemId() === botItem.botData.id)
                {
                    cancelRoomObjectPlacement();

                    CreateLinkEvent('inventory/open');
                }

                newValue.splice(index, 1);
            }

            for(const botData of addedDatas)
            {
                const botItem = { botData } as IBotItem;
                const unseen = isUnseen(UnseenItemCategory.BOT, botData.id);

                if(unseen) newValue.unshift(botItem);
                else newValue.push(botItem);
            }

            return newValue;
        });
    });

    useMessageEvent<BotAddedToInventoryEvent>(BotAddedToInventoryEvent, event =>
    {
        const parser = event.getParser();

        setBotItems(prevValue =>
        {
            const newValue = [ ...prevValue ];

            const index = newValue.findIndex(item => (item.botData.id === parser.item.id));

            if(index >= 0) return prevValue;

            const botItem = { botData: parser.item } as IBotItem;
            const unseen = isUnseen(UnseenItemCategory.BOT, botItem.botData.id);

            if(unseen) newValue.unshift(botItem);
            else newValue.push(botItem);

            return newValue;
        });
    });

    useMessageEvent<BotRemovedFromInventoryEvent>(BotRemovedFromInventoryEvent, event =>
    {
        const parser = event.getParser();

        setBotItems(prevValue =>
        {
            const newValue = [ ...prevValue ];

            const index = newValue.findIndex(item => (item.botData.id === parser.itemId));

            if(index === -1) return prevValue;

            newValue.splice(index, 1);

            if(getPlacingItemId() === parser.itemId)
            {
                cancelRoomObjectPlacement();

                CreateLinkEvent('inventory/show');
            }

            return newValue;
        });
    });

    useEffect(() =>
    {
        if(!botItems || !botItems.length) return;

        setSelectedBot(prevValue =>
        {
            let newValue = prevValue;

            if(newValue && (botItems.indexOf(newValue) === -1)) newValue = null;

            if(!newValue) newValue = botItems[0];

            return newValue;
        });
    }, [ botItems ]);

    useEffect(() =>
    {
        if(!isVisible) return;

        return () =>
        {
            resetCategory(UnseenItemCategory.BOT);
        };
    }, [ isVisible, resetCategory ]);

    useEffect(() =>
    {
        if(!isVisible || !needsUpdate) return;

        SendMessageComposer(new GetBotInventoryComposer());

        setNeedsUpdate(false);
    }, [ isVisible, needsUpdate ]);

    return { botItems, selectedBot, setSelectedBot, activate, deactivate };
};

export const useInventoryBots = () => useBetween(useInventoryBotsState);
