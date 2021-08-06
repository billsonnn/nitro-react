import { SetActivatedBadgesComposer } from '@nitrots/nitro-renderer';
import { Reducer } from 'react';
import { SendMessageHook } from '../../../hooks/messages/message-event';

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
    public static SET_NEEDS_UPDATE: string = 'IBA_SET_NEEDS_UPDATE';
    public static SET_BADGE: string = 'IBA_SET_BADGE';
    public static SET_BADGES: string = 'IBA_SET_BADGES';
    public static ADD_BADGE: string = 'IBA_ADD_BADGE';
    public static ADD_ACTIVE_BADGE: string = 'IBA_ADD_ACTIVE_BADGE';
    public static REMOVE_ACTIVE_BADGE: string = 'IBA_REMOVE_ACTIVE_BADGE';
}

export const initialInventoryBadge: IInventoryBadgeState = {
    needsBadgeUpdate: true,
    badge: null,
    badges: [],
    activeBadges: []
}

export const InventoryBadgeReducer: Reducer<IInventoryBadgeState, IInventoryBadgeAction> = (state, action) =>
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
                
                badges.push(badgeCode);

                if(wearingIndex >= 0) activeBadges.push(badgeCode);
            }

            return { ...state, badges, activeBadges };
        }
        case InventoryBadgeActions.ADD_BADGE: {
            const badges = [ ...state.badges ];
            const badge = (action.payload.badgeCode);

            if(badges.indexOf(badge) === -1) badges.push(badge);

            return { ...state, badges };
        }
        case InventoryBadgeActions.ADD_ACTIVE_BADGE: {
            const badgeCode = action.payload.badgeCode;

            if(state.activeBadges.indexOf(badgeCode) >= 0) return state;

            const activeBadges = [ ...state.activeBadges ];

            activeBadges.push(badgeCode);

            const composer = new SetActivatedBadgesComposer();

            for(const badgeCode of activeBadges)
            {
                composer.addActivatedBadge(badgeCode);
            }

            SendMessageHook(composer);

            return { ...state, activeBadges };
        }
        case InventoryBadgeActions.REMOVE_ACTIVE_BADGE: {
            const badgeCode = action.payload.badgeCode;

            const index = state.activeBadges.indexOf(badgeCode);

            if(index === -1) return state;

            const activeBadges = [ ...state.activeBadges ];

            activeBadges.splice(index, 1);

            const composer = new SetActivatedBadgesComposer();

            for(const badgeCode of activeBadges)
            {
                composer.addActivatedBadge(badgeCode);
            }

            SendMessageHook(composer);

            return { ...state, activeBadges };
        }
        default:
            return state;
    }
}
