import { Reducer } from 'react';
import { AchievementCategory } from '../utils/AchievementCategory';

export interface IAchievementsState
{
    categories: AchievementCategory[],
    score: number,
    selectedCategoryName: string,
    selectedAchievementId: number
}

export interface IAchievementsAction
{
    type: string;
    payload: {
        categories?: AchievementCategory[],
        score?: number,
        selectedCategoryName?: string,
        selectedAchievementId?: number
    }
}

export class AchievementsActions
{
    public static SET_CATEGORIES: string = 'AA_SET_CATEGORIES';
    public static SET_SCORE: string = 'AA_SET_SCORE';
    public static SELECT_CATEGORY: string = 'AA_SELECT_CATEGORY';
    public static SELECT_ACHIEVEMENT: string = 'AA_SELECT_ACHIEVEMENT';
}

export const initialAchievements: IAchievementsState = {
    categories: null,
    score: null,
    selectedCategoryName: null,
    selectedAchievementId: null
}

export const AchievementsReducer: Reducer<IAchievementsState, IAchievementsAction> = (state, action) =>
{
    switch(action.type)
    {
        case AchievementsActions.SET_CATEGORIES: {
            const categories = (action.payload.categories || state.categories || null);

            let selectedCategoryName = null;

            if(categories.length > 0)
            {
                selectedCategoryName = categories[0].name;    
            }

            return { ...state, categories, selectedCategoryName };
        }
        case AchievementsActions.SET_SCORE: {
            const score = (action.payload.score || state.score || null);

            return { ...state, score };
        }
        case AchievementsActions.SELECT_CATEGORY: {
            const selectedCategoryName = (action.payload.selectedCategoryName || state.selectedCategoryName || null);

            let selectedAchievementId = null;

            if(selectedCategoryName)
            {
                const category = state.categories.find(category => category.name === selectedCategoryName);

                if(category && category.achievements.length > 0)
                {
                    selectedAchievementId = category.achievements[0].achievementId;    
                }
            }
           
            return { ...state, selectedCategoryName, selectedAchievementId };
        }
        case AchievementsActions.SELECT_ACHIEVEMENT: {
            const selectedAchievementId = (action.payload.selectedAchievementId || state.selectedAchievementId || null);

            return { ...state, selectedAchievementId };
        }
        default:
            return state;
    }
}
