import { RequestBadgesComposer } from '@nitrots/nitro-renderer';
import { FC, useEffect } from 'react';
import { LocalizeBadgeName, LocalizeText } from '../../../../api';
import { SendMessageHook } from '../../../../hooks/messages/message-event';
import { NitroLayoutButton, NitroLayoutFlex } from '../../../../layout';
import { NitroLayoutBase } from '../../../../layout/base';
import { NitroLayoutFlexColumn } from '../../../../layout/flex-column/NitroLayoutFlexColumn';
import { NitroLayoutGridColumn } from '../../../../layout/grid/column/NitroLayoutGridColumn';
import { NitroLayoutGrid } from '../../../../layout/grid/NitroLayoutGrid';
import { BadgeImageView } from '../../../shared/badge-image/BadgeImageView';
import { useInventoryContext } from '../../context/InventoryContext';
import { InventoryBadgeActions } from '../../reducers/InventoryBadgeReducer';
import { InventoryActiveBadgeResultsView } from './active-results/InventoryActiveBadgeResultsView';
import { InventoryBadgeViewProps } from './InventoryBadgeView.types';
import { InventoryBadgeResultsView } from './results/InventoryBadgeResultsView';

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
        <NitroLayoutGrid>
            <NitroLayoutGridColumn size={ 7 }>
                <InventoryBadgeResultsView badges={ badges } activeBadges={ activeBadges } />
            </NitroLayoutGridColumn>
            <NitroLayoutGridColumn className="justify-content-between" size={ 5 } overflow="auto">
                <NitroLayoutFlexColumn overflow="hidden" gap={ 2 }>
                    <NitroLayoutBase className="text-black text-truncate">{ LocalizeText('inventory.badges.activebadges') }</NitroLayoutBase>
                    <InventoryActiveBadgeResultsView badges={ activeBadges }  />
                </NitroLayoutFlexColumn>
                { badge && (badge.length > 0) &&
                    <NitroLayoutFlexColumn gap={ 2 }>
                        <NitroLayoutFlex className="justify-content-between align-items-center">
                            <NitroLayoutFlex className="flex-grow-1 align-items-center" gap={ 2 } overflow="hidden">
                                <BadgeImageView badgeCode={ badge } />
                                <NitroLayoutBase className="flex-grow-1 text-black text-truncate">{ LocalizeBadgeName(badge) }</NitroLayoutBase>
                            </NitroLayoutFlex>
                        </NitroLayoutFlex>
                        <NitroLayoutButton variant={ (isWearingBadge(badge) ? 'danger' : 'success') } size="sm" disabled={ !isWearingBadge(badge) && !canWearBadges() } onClick={ toggleBadge }>{ LocalizeText(isWearingBadge(badge) ? 'inventory.badges.clearbadge' : 'inventory.badges.wearbadge') }</NitroLayoutButton>
                    </NitroLayoutFlexColumn> }
            </NitroLayoutGridColumn>
        </NitroLayoutGrid>
    );
}
