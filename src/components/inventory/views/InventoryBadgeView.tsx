import { FC, useEffect } from 'react';
import { IBadgeItem, LocalizeBadgeName, LocalizeText, UnseenItemCategory } from '../../../api';
import { AutoGrid, Button, Column, Flex, Grid, LayoutBadgeImageView, LayoutGridItem, Text } from '../../../common';
import { useSharedInventoryBadges, useSharedInventoryUnseenTracker } from '../../../hooks';

export const InventoryBadgeView: FC<{}> = props =>
{
    const { badges = [], activeBadges = [], selectedBadge = null, isWearingBadge = null, canWearBadges = null, toggleBadge = null, selectBadge = null } = useSharedInventoryBadges();
    const { getCount = null, resetCategory = null, isUnseen = null, removeUnseen = null } = useSharedInventoryUnseenTracker();

    useEffect(() =>
    {
        if(!badges || !badges.length) return;
        
        return () =>
        {
            const count = getCount(UnseenItemCategory.BADGE);

            if(!count) return;

            resetCategory(UnseenItemCategory.BADGE);
        }
    }, [ badges, getCount, resetCategory ]);

    const InventoryBadgeItemView: FC<{ badge: IBadgeItem }> = props =>
    {
        const { badge = null, children = null, ...rest } = props;
        const unseen = isUnseen(UnseenItemCategory.BADGE, badge.id);

        const select = () =>
        {
            selectBadge(badge);

            if(unseen) removeUnseen(UnseenItemCategory.BADGE, badge.id);
        }

        return (
            <LayoutGridItem itemActive={ (selectedBadge === badge) } itemUnseen={ unseen } onMouseDown={ select } { ...rest }> 
                <LayoutBadgeImageView badgeCode={ badge.badgeCode } />
                { children }
            </LayoutGridItem>
        );
    }

    return (
        <Grid>
            <Column size={ 7 } overflow="hidden">
                <AutoGrid columnCount={ 4 }>
                    { badges && (badges.length > 0) && badges.map((badge, index) =>
                        {
                            if(activeBadges.indexOf(badge) >= 0) return null;

                            return <InventoryBadgeItemView key={ index } badge={ badge } />
                        }) }
                </AutoGrid>
            </Column>
            <Column className="justify-content-between" size={ 5 } overflow="auto">
                <Column overflow="hidden" gap={ 2 }>
                    <Text>{ LocalizeText('inventory.badges.activebadges') }</Text>
                    <AutoGrid columnCount={ 3 }>
                        { activeBadges && (activeBadges.length > 0) && activeBadges.map((badge, index) => <InventoryBadgeItemView key={ index } badge={ badge } />) }
                    </AutoGrid>
                </Column>
                { !!selectedBadge &&
                    <Column grow justifyContent="end" gap={ 2 }>
                        <Flex alignItems="center" gap={ 2 }>
                            <LayoutBadgeImageView shrink badgeCode={ selectedBadge.badgeCode } />
                            <Text>{ LocalizeBadgeName(selectedBadge.badgeCode) }</Text>
                        </Flex>
                        <Button variant={ (isWearingBadge(selectedBadge) ? 'danger' : 'success') } disabled={ !isWearingBadge(selectedBadge) && !canWearBadges() } onClick={ event => toggleBadge(selectedBadge) }>{ LocalizeText(isWearingBadge(selectedBadge) ? 'inventory.badges.clearbadge' : 'inventory.badges.wearbadge') }</Button>
                    </Column> }
            </Column>
        </Grid>
    );
}
