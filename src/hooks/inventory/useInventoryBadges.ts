import { BadgeReceivedEvent, BadgesEvent, RequestBadgesComposer, SetActivatedBadgesComposer } from '@nitrots/nitro-renderer';
import { useCallback, useEffect, useState } from 'react';
import { useBetween } from 'use-between';
import { UseMessageEventHook } from '..';
import { GetConfiguration, SendMessageComposer, UnseenItemCategory } from '../../api';
import { useSharedVisibility } from '../useSharedVisibility';
import { useInventoryUnseenTracker } from './useInventoryUnseenTracker';

const useInventoryBadgesState = () =>
{
    const [ needsUpdate, setNeedsUpdate ] = useState(true);
    const [ badgeCodes, setBadgeCodes ] = useState<string[]>([]);
    const [ badgeIds, setBadgeIds ] = useState<number[]>([]);
    const [ activeBadgeCodes, setActiveBadgeCodes ] = useState<string[]>([]);
    const [ selectedBadgeCode, setSelectedBadgeCode ] = useState<string>(null);
    const { isVisible = false, activate = null, deactivate = null } = useSharedVisibility();
    const { isUnseen = null, resetCategory = null } = useInventoryUnseenTracker();

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

    const getBadgeId = (badgeCode: string) =>
    {
        const index = badgeCodes.indexOf(badgeCode);

        if(index === -1) return 0;

        return (badgeIds[index] || 0);
    }

    const onBadgesEvent = useCallback((event: BadgesEvent) =>
    {
        const parser = event.getParser();
        const newBadgeCodes = parser.getAllBadgeCodes();
        const newBadgeIds: number[] = [];

        for(const newBadgeCode of newBadgeCodes) newBadgeIds.push(parser.getBadgeId(newBadgeCode));

        setBadgeCodes(newBadgeCodes);
        setBadgeIds(newBadgeIds);
        setActiveBadgeCodes(parser.getActiveBadgeCodes());
    }, []);

    UseMessageEventHook(BadgesEvent, onBadgesEvent);

    const onBadgeReceivedEvent = useCallback((event: BadgeReceivedEvent) =>
    {
        const parser = event.getParser();
        const unseen = isUnseen(UnseenItemCategory.BADGE, parser.badgeId);

        setBadgeCodes(prevValue =>
        {
            const newValue = [ ...prevValue ];

            if(unseen) newValue.unshift(parser.badgeCode)
            else newValue.push(parser.badgeCode);

            return newValue;
        });

        setBadgeIds(prevValue =>
        {
            const newValue = [ ...prevValue ];

            if(unseen) newValue.unshift(parser.badgeId)
            else newValue.push(parser.badgeId);

            return newValue;
        });
    }, [ isUnseen ]);

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
        if(!isVisible) return;

        return () =>
        {
            resetCategory(UnseenItemCategory.BADGE);
        }
    }, [ isVisible, resetCategory ]);

    useEffect(() =>
    {
        if(!isVisible || !needsUpdate) return;

        SendMessageComposer(new RequestBadgesComposer());

        setNeedsUpdate(false);
    }, [ isVisible, needsUpdate ]);

    return { badgeCodes, activeBadgeCodes, selectedBadgeCode, setSelectedBadgeCode, isWearingBadge, canWearBadges, toggleBadge, getBadgeId, activate, deactivate };
}

export const useInventoryBadges = () => useBetween(useInventoryBadgesState);
