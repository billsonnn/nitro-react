import { Reducer } from 'react';

export interface IInventoryBadgeState
{
    needsBadgeUpdate: boolean;
    badge: string;
    badges: string[];
    activeBadges: string[];
}

export interface IInventoryBadgeAction
{
    type: string;
    payload: {
        flag?: boolean;
        badgeCode?: string;
        badgeCodes?: string[];
        activeBadgeCodes?: string[];
    }
}

export class InventoryBadgeActions
{
    public static SET_NEEDS_UPDATE: string = 'IBDA_SET_NEEDS_UPDATE';
    public static SET_BADGE: string = 'IBDA_SET_BADGE';
    public static SET_BADGES: string = 'IBDA_SET_BADGES';
}

export const initialInventoryBadge: IInventoryBadgeState = {
    needsBadgeUpdate: true,
    badge: null,
    badges: [],
    activeBadges: []
}

export const inventoryBadgeReducer: Reducer<IInventoryBadgeState, IInventoryBadgeAction> = (state, action) =>
{
    switch(action.type)
    {
        case InventoryBadgeActions.SET_NEEDS_UPDATE:
            return { ...state, needsBadgeUpdate: (action.payload.flag || false) };
        case InventoryBadgeActions.SET_BADGE: {
                let badge = (action.payload.badgeCode || state.badge || null);
    
                let index = 0;
    
                if(badge)
                {
                    const foundIndex = state.badges.indexOf(badge);
    
                    if(foundIndex > -1) index = foundIndex;
                }
    
                badge = (state.badges[index] || null);
    
                return { ...state, badge };
            }
        case InventoryBadgeActions.SET_BADGES: {
            const badges: string[] = [];
            const activeBadges: string[] = [];

            const badgeCodes = action.payload.badgeCodes;
            const activeBadgeCodes = action.payload.activeBadgeCodes;

            for(const badgeCode of badgeCodes)
            {
                const wearingIndex = activeBadgeCodes.indexOf(badgeCode);

                if(wearingIndex === -1) badges.push(badgeCode);
                else activeBadges.push(badgeCode);
            }

            return { ...state, badges, activeBadges };
        }
        default:
            return state;
    }
}
