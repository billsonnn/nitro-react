import { FC, useEffect, useState } from 'react';
import { LocalizeBadgeName, LocalizeText, UnseenItemCategory } from '../../../../api';
import { AutoGrid, Button, Column, Grid, LayoutBadgeImageView, Text } from '../../../../common';
import { useInventoryBadges, useInventoryUnseenTracker } from '../../../../hooks';
import { InventoryBadgeItemView } from './InventoryBadgeItemView';

export const InventoryBadgeView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const { badgeCodes = [], activeBadgeCodes = [], selectedBadgeCode = null, isWearingBadge = null, canWearBadges = null, toggleBadge = null, getBadgeId = null, activate = null, deactivate = null } = useInventoryBadges();
    const { isUnseen = null, removeUnseen = null } = useInventoryUnseenTracker();

    useEffect(() =>
    {
        if(!selectedBadgeCode || !isUnseen(UnseenItemCategory.BADGE, getBadgeId(selectedBadgeCode))) return;

        removeUnseen(UnseenItemCategory.BADGE, getBadgeId(selectedBadgeCode));
    }, [ selectedBadgeCode, isUnseen, removeUnseen, getBadgeId ]);

    useEffect(() =>
    {
        if(!isVisible) return;

        const id = activate();

        return () => deactivate(id);
    }, [ isVisible, activate, deactivate ]);

    useEffect(() =>
    {
        setIsVisible(true);

        return () => setIsVisible(false);
    }, []);

    return (
        <Grid>
            <Column overflow="hidden" size={ 7 }>
                <AutoGrid columnCount={ 4 }>
                    { badgeCodes && (badgeCodes.length > 0) && badgeCodes.map((badgeCode, index) =>
                    {
                        if(isWearingBadge(badgeCode)) return null;

                        return <InventoryBadgeItemView key={ index } badgeCode={ badgeCode } />
                    }) }
                </AutoGrid>
            </Column>
            <Column className="justify-content-between" overflow="auto" size={ 5 }>
                <Column gap={ 2 } overflow="hidden">
                    <Text>{ LocalizeText('inventory.badges.activebadges') }</Text>
                    <AutoGrid columnCount={ 3 }>
                        { activeBadgeCodes && (activeBadgeCodes.length > 0) && activeBadgeCodes.map((badgeCode, index) => <InventoryBadgeItemView key={ index } badgeCode={ badgeCode } />) }
                    </AutoGrid>
                </Column>
                { !!selectedBadgeCode &&
                    <Column grow gap={ 2 } justifyContent="end">
                        <div className="items-center gap-2">
                            <LayoutBadgeImageView shrink badgeCode={ selectedBadgeCode } />
                            <Text>{ LocalizeBadgeName(selectedBadgeCode) }</Text>
                        </div>
                        <Button disabled={ !isWearingBadge(selectedBadgeCode) && !canWearBadges() } variant={ (isWearingBadge(selectedBadgeCode) ? 'danger' : 'success') } onClick={ event => toggleBadge(selectedBadgeCode) }>{ LocalizeText(isWearingBadge(selectedBadgeCode) ? 'inventory.badges.clearbadge' : 'inventory.badges.wearbadge') }</Button>
                    </Column> }
            </Column>
        </Grid>
    );
}
