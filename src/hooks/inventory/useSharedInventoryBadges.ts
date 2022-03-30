import { BadgeReceivedEvent, BadgesEvent, RequestBadgesComposer, SetActivatedBadgesComposer } from '@nitrots/nitro-renderer';
import { useCallback, useEffect, useState } from 'react';
import { useBetween } from 'use-between';
import { BatchUpdates, UseMessageEventHook } from '..';
import { GetConfiguration, IBadgeItem, SendMessageComposer } from '../../api';
import { useSharedVisibility } from '../useSharedVisibility';

const useInventoryBadges = () =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const [ needsUpdate, setNeedsUpdate ] = useState(true);
    const [ badges, setBadges ] = useState<IBadgeItem[]>([]);
    const [ activeBadges, setActiveBadges ] = useState<IBadgeItem[]>([]);
    const [ selectedBadge, setSelectedBadge ] = useState<IBadgeItem>(null);

    const maxBadgeCount = GetConfiguration<number>('user.badges.max.slots', 5);
    const isWearingBadge = (badge: IBadgeItem) => (activeBadges.indexOf(badge) >= 0);
    const canWearBadges = () => (activeBadges.length < maxBadgeCount);

    const toggleBadge = (badge: IBadgeItem) =>
    {
        setActiveBadges(prevValue =>
            {
                const newValue = [ ...prevValue ];

                const index = newValue.indexOf(badge);

                if(index === -1)
                {
                    if(!canWearBadges()) return prevValue;

                    newValue.push(badge);
                }
                else
                {
                    newValue.splice(index, 1);
                }

                const composer = new SetActivatedBadgesComposer();

                for(let i = 0; i < maxBadgeCount; i++) composer.addActivatedBadge((newValue[i] && newValue[i].badgeCode) || null);

                SendMessageComposer(composer);

                return newValue;
            });
    }

    const selectBadge = (badge: IBadgeItem) =>
    {
        if(badges.indexOf(badge) === -1) return;

        setSelectedBadge(badge);
    }

    const onBadgesEvent = useCallback((event: BadgesEvent) =>
    {
        const parser = event.getParser();

        BatchUpdates(() =>
        {
            setBadges(prevValue =>
                {
                    const newValue: IBadgeItem[] = [];
                    const badgeCodes = parser.getAllBadgeCodes();

                    for(const badgeCode of badgeCodes) newValue.push({ id: parser.getBadgeId(badgeCode), badgeCode });

                    return newValue;
                });

            setActiveBadges(prevValue =>
                {
                    const newValue: IBadgeItem[] = [];
                    const badgeCodes = parser.getActiveBadgeCodes();

                    for(const badgeCode of badgeCodes) newValue.push({ id: parser.getBadgeId(badgeCode), badgeCode });

                    return newValue;
                });
        });
    }, []);

    UseMessageEventHook(BadgesEvent, onBadgesEvent);

    const onBadgeReceivedEvent = useCallback((event: BadgeReceivedEvent) =>
    {
        const parser = event.getParser();

        setBadges(prevValue =>
            {
                const newValue = [ ...prevValue ];

                newValue.push({ id: parser.badgeId, badgeCode: parser.badgeCode });

                return newValue;
            });
    }, []);

    UseMessageEventHook(BadgeReceivedEvent, onBadgeReceivedEvent);

    useEffect(() =>
    {
        if(!badges || !badges.length) return;

        setSelectedBadge(prevValue =>
            {
                let newValue = prevValue;

                if(newValue && (badges.indexOf(newValue) === -1)) newValue = null;

                if(!newValue) newValue = badges[0];

                return newValue;
            });
    }, [ badges ]);

    useEffect(() =>
    {
        if(!isVisible || !needsUpdate) return;

        SendMessageComposer(new RequestBadgesComposer());

        setNeedsUpdate(false);
    }, [ isVisible, needsUpdate ]);

    return { badges, activeBadges, selectedBadge, isWearingBadge, canWearBadges, toggleBadge, selectBadge, setIsVisible };
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
