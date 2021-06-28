import { createContext, FC, useContext } from 'react';
import { AchievementsContextProps, IAchievementsContext } from './AchievementsContext.types';

const AchievementsContext = createContext<IAchievementsContext>({
    achievementsState: null,
    dispatchAchievementsState: null
});

export const AchievementsContextProvider: FC<AchievementsContextProps> = props =>
{
    return <AchievementsContext.Provider value={ props.value }>{ props.children }</AchievementsContext.Provider>
}

export const useAchievementsContext = () => useContext(AchievementsContext);
