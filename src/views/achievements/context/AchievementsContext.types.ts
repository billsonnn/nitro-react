import { Dispatch, ProviderProps } from 'react';
import { IAchievementsAction, IAchievementsState } from '../reducers/AchievementsReducer';

export interface IAchievementsContext
{
    achievementsState: IAchievementsState;
    dispatchAchievementsState: Dispatch<IAchievementsAction>;
}

export interface AchievementsContextProps extends ProviderProps<IAchievementsContext>
{

}
