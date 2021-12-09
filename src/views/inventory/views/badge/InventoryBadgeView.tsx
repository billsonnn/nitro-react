import { RequestBadgesComposer } from '@nitrots/nitro-renderer';
import { FC, useEffect } from 'react';
import { LocalizeBadgeName, LocalizeText } from '../../../../api';
import { Button } from '../../../../common/Button';
import { Column } from '../../../../common/Column';
import { Flex } from '../../../../common/Flex';
import { Grid } from '../../../../common/Grid';
import { Text } from '../../../../common/Text';
import { SendMessageHook } from '../../../../hooks/messages/message-event';
import { BadgeImageView } from '../../../shared/badge-image/BadgeImageView';
import { useInventoryContext } from '../../context/InventoryContext';
import { InventoryBadgeActions } from '../../reducers/InventoryBadgeReducer';
import { InventoryBadgeItemView } from './InventoryBadgeItemView';

export interface InventoryBadgeViewProps
{
}

export const InventoryBadgeView: FC<InventoryBadgeViewProps> = props =>
{
    const { badgeState = null, dispatchBadgeState = null } = useInventoryContext();
    const { needsBadgeUpdate = false, badge = null, badges = [], activeBadges = [] } = badgeState;

    useEffect(() =>
    {
        if(needsBadgeUpdate)
        {
            dispatchBadgeState({
                type: InventoryBadgeActions.SET_NEEDS_UPDATE,
                payload: {
                    flag: false
                }
            });
            
            SendMessageHook(new RequestBadgesComposer());
        }
        else
        {
            dispatchBadgeState({
                type: InventoryBadgeActions.SET_BADGE,
                payload: {
                    badgeCode: null
                }
            });
        }

    }, [ needsBadgeUpdate, badges, dispatchBadgeState ]);

    function isWearingBadge(badgeCode: string): boolean
    {
        return (activeBadges.indexOf(badgeCode) >= 0);
    }

    function canWearBadges(): boolean
    {
        return (activeBadges.length < 5);
    }

    function toggleBadge(): void
    {
        if(isWearingBadge(badge))
        {
            dispatchBadgeState({
                type: InventoryBadgeActions.REMOVE_ACTIVE_BADGE,
                payload: {
                    badgeCode: badge
                }
            });
        }
        else
        {
            if(!canWearBadges()) return;

            dispatchBadgeState({
                type: InventoryBadgeActions.ADD_ACTIVE_BADGE,
                payload: {
                    badgeCode: badge
                }
            });
        }
    }

    return (
        <Grid>
            <Column size={ 7 } overflow="hidden">
                <Grid grow columnCount={ 5 } overflow="auto">
                    { badges && (badges.length > 0) && badges.map((code, index) =>
                        {
                            if(activeBadges.indexOf(code) >= 0) return null;

                            return <InventoryBadgeItemView key={ code } badgeCode={ code } />
                        }) }
                </Grid>
            </Column>
            <Column className="justify-content-between" size={ 5 } overflow="auto">
                <Column overflow="hidden" gap={ 2 }>
                    <Text>{ LocalizeText('inventory.badges.activebadges') }</Text>
                    <Grid grow columnCount={ 3 } overflow="auto">
                        { activeBadges && (activeBadges.length > 0) && activeBadges.map((code, index) => <InventoryBadgeItemView key={ code } badgeCode={ code } />) }
                    </Grid>
                </Column>
                { badge && (badge.length > 0) &&
                    <Column grow justifyContent="end" gap={ 2 }>
                        <Flex alignItems="center" gap={ 2 }>
                            <BadgeImageView badgeCode={ badge } />
                            <Text>{ LocalizeBadgeName(badge) }</Text>
                        </Flex>
                        <Button variant={ (isWearingBadge(badge) ? 'danger' : 'success') } size="sm" disabled={ !isWearingBadge(badge) && !canWearBadges() } onClick={ toggleBadge }>{ LocalizeText(isWearingBadge(badge) ? 'inventory.badges.clearbadge' : 'inventory.badges.wearbadge') }</Button>
                    </Column> }
            </Column>
        </Grid>
    );
}
