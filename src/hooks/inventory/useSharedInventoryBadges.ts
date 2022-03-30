import { BadgeReceivedEvent, BadgesEvent, RequestBadgesComposer, SetActivatedBadgesComposer } from '@nitrots/nitro-renderer';
import { useCallback, useEffect, useState } from 'react';
import { useBetween } from 'use-between';
import { BatchUpdates, UseMessageEventHook } from '..';
import { GetConfiguration, SendMessageComposer } from '../../api';
import { useSharedVisibility } from '../useSharedVisibility';

const useInventoryBadges = () =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const [ needsUpdate, setNeedsUpdate ] = useState(true);
    const [ badgeCodes, setBadgeCodes ] = useState<string[]>([]);
    const [ badgeIds, setBadgeIds ] = useState<number[]>([]);
    const [ activeBadgeCodes, setActiveBadgeCodes ] = useState<string[]>([]);
    const [ selectedBadgeCode, setSelectedBadgeCode ] = useState<string>(null);

    const maxBadgeCount = GetConfiguration<number>('user.badges.max.slots', 5);
    const isWearingBadge = (badgeCode: string) => (activeBadgeCodes.indexOf(badgeCode) >= 0);
    const canWearBadges = () => (activeBadgeCodes.length < maxBadgeCount);

    const toggleBadge = (badgeCode: string) =>
    {
        setActiveBadgeCodes(prevValue =>
            {
                const newValue = [ ...prevValue ];

                const index = newValue.indexOf(badgeCode);

                if(index === -1)
                {
                    if(!canWearBadges()) return prevValue;

                    newValue.push(badgeCode);
                }
                else
                {
                    newValue.splice(index, 1);
                }

                const composer = new SetActivatedBadgesComposer();

                for(let i = 0; i < maxBadgeCount; i++) composer.addActivatedBadge(newValue[i] || null);

                SendMessageComposer(composer);

                return newValue;
            });
    }

    const selectBadge = (badgeCode: string) =>
    {
        if(badgeCodes.indexOf(badgeCode) === -1) return;

        setSelectedBadgeCode(badgeCode);
    }

    const getBadgeId = (badgeCode: string) =>
    {
        const index = badgeCodes.indexOf(badgeCode);

        if(index === -1) return 0;

        return (badgeIds[index] || 0);
    }

    const onBadgesEvent = useCallback((event: BadgesEvent) =>
    {
        const parser = event.getParser();

        BatchUpdates(() =>
        {
            const newBadgeCodes = parser.getAllBadgeCodes();
            const newBadgeIds: number[] = [];

            for(const newBadgeCode of newBadgeCodes) newBadgeIds.push(parser.getBadgeId(newBadgeCode));

            setBadgeCodes(newBadgeCodes);
            setBadgeIds(newBadgeIds);
            setActiveBadgeCodes(parser.getActiveBadgeCodes());
        });
    }, []);

    UseMessageEventHook(BadgesEvent, onBadgesEvent);

    const onBadgeReceivedEvent = useCallback((event: BadgeReceivedEvent) =>
    {
        const parser = event.getParser();

        BatchUpdates(() =>
        {
            setBadgeCodes(prevValue =>
                {
                    const newValue = [ ...prevValue ];

                    newValue.push(parser.badgeCode);
    
                    return newValue;
                });
    
            setBadgeIds(prevValue =>
                {
                    const newValue = [ ...prevValue ];
    
                    newValue.push(parser.badgeId);
    
                    return newValue;
                })
        });
    }, []);

    UseMessageEventHook(BadgeReceivedEvent, onBadgeReceivedEvent);

    useEffect(() =>
    {
        if(!badgeCodes || !badgeCodes.length) return;

        setSelectedBadgeCode(prevValue =>
            {
                let newValue = prevValue;

                if(newValue && (badgeCodes.indexOf(newValue) === -1)) newValue = null;

                if(!newValue) newValue = badgeCodes[0];

                return newValue;
            });
    }, [ badgeCodes ]);

    useEffect(() =>
    {
        if(!isVisible || !needsUpdate) return;

        SendMessageComposer(new RequestBadgesComposer());

        setNeedsUpdate(false);
    }, [ isVisible, needsUpdate ]);

    return { badgeCodes, activeBadgeCodes, selectedBadgeCode, isWearingBadge, canWearBadges, toggleBadge, selectBadge, getBadgeId, setIsVisible };
}

export const useSharedInventoryBadges = () =>
{
    const { setIsVisible, ...rest } = useBetween(useInventoryBadges);
    const { isVisible = false, activate = null, deactivate = null } = useSharedVisibility();

    useEffect(() =>
    {
        const id = activate();

        return () => deactivate(id);
    }, [ activate, deactivate ]);

    useEffect(() =>
    {
        setIsVisible(isVisible);
    }, [ isVisible, setIsVisible ]);

    return { ...rest };
}
