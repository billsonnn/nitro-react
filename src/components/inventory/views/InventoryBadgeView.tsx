import { FC, useEffect } from 'react';
import { LocalizeBadgeName, LocalizeText, UnseenItemCategory } from '../../../api';
import { AutoGrid, Button, Column, Flex, Grid, LayoutBadgeImageView, LayoutGridItem, Text } from '../../../common';
import { useInventoryBadges, useInventoryUnseenTracker } from '../../../hooks';

export const InventoryBadgeView: FC<{}> = props =>
{
    const { badgeCodes = [], activeBadgeCodes = [], selectedBadgeCode = null, isWearingBadge = null, canWearBadges = null, toggleBadge = null, selectBadge = null, getBadgeId = null } = useInventoryBadges();
    const { getCount = null, resetCategory = null, isUnseen = null, removeUnseen = null } = useInventoryUnseenTracker();

    useEffect(() =>
    {
        if(!badgeCodes || !badgeCodes.length) return;
        
        return () =>
        {
            const count = getCount(UnseenItemCategory.BADGE);

            if(!count) return;

            resetCategory(UnseenItemCategory.BADGE);
        }
    }, [ badgeCodes, getCount, resetCategory ]);

    const InventoryBadgeItemView: FC<{ badgeCode: string }> = props =>
    {
        const { badgeCode = null, children = null, ...rest } = props;
        const badgeId = getBadgeId(badgeCode);
        const unseen = isUnseen(UnseenItemCategory.BADGE, badgeId);

        const select = () =>
        {
            selectBadge(badgeCode);

            if(unseen) removeUnseen(UnseenItemCategory.BADGE, badgeId);
        }

        return (
            <LayoutGridItem itemActive={ (selectedBadgeCode === badgeCode) } itemUnseen={ unseen } onMouseDown={ select } { ...rest }> 
                <LayoutBadgeImageView badgeCode={ badgeCode } />
                { children }
            </LayoutGridItem>
        );
    }

    return (
        <Grid>
            <Column size={ 7 } overflow="hidden">
                <AutoGrid columnCount={ 4 }>
                    { badgeCodes && (badgeCodes.length > 0) && badgeCodes.map((badgeCode, index) =>
                        {
                            if(activeBadgeCodes.indexOf(badgeCode) >= 0) return null;

                            return <InventoryBadgeItemView key={ index } badgeCode={ badgeCode } />
                        }) }
                </AutoGrid>
            </Column>
            <Column className="justify-content-between" size={ 5 } overflow="auto">
                <Column overflow="hidden" gap={ 2 }>
                    <Text>{ LocalizeText('inventory.badges.activebadges') }</Text>
                    <AutoGrid columnCount={ 3 }>
                        { activeBadgeCodes && (activeBadgeCodes.length > 0) && activeBadgeCodes.map((badgeCode, index) => <InventoryBadgeItemView key={ index } badgeCode={ badgeCode } />) }
                    </AutoGrid>
                </Column>
                { !!selectedBadgeCode &&
                    <Column grow justifyContent="end" gap={ 2 }>
                        <Flex alignItems="center" gap={ 2 }>
                            <LayoutBadgeImageView shrink badgeCode={ selectedBadgeCode } />
                            <Text>{ LocalizeBadgeName(selectedBadgeCode) }</Text>
                        </Flex>
                        <Button variant={ (isWearingBadge(selectedBadgeCode) ? 'danger' : 'success') } disabled={ !isWearingBadge(selectedBadgeCode) && !canWearBadges() } onClick={ event => toggleBadge(selectedBadgeCode) }>{ LocalizeText(isWearingBadge(selectedBadgeCode) ? 'inventory.badges.clearbadge' : 'inventory.badges.wearbadge') }</Button>
                    </Column> }
            </Column>
        </Grid>
    );
}
