import { AchievementEvent, AchievementsEvent, AchievementsScoreEvent } from 'nitro-renderer';
import { FC, useCallback } from 'react';
import { CreateMessageHook } from '../../hooks/messages';
import { IAchievementsMessageHandlerProps } from './AchievementsMessageHandler.types';
import { useAchievementsContext } from './context/AchievementsContext';
import { AchievementsActions } from './reducers/AchievementsReducer';
import { AchievementCategory } from './utils/AchievementCategory';

export const AchievementsMessageHandler: FC<IAchievementsMessageHandlerProps> = props =>
{
    const { achievementsState = null, dispatchAchievementsState = null } = useAchievementsContext();

    const onAchievementEvent = useCallback((event: AchievementEvent) =>
    {
        const parser = event.getParser();

        console.log(parser);

    }, [ dispatchAchievementsState ]);

    const onAchievementsEvent = useCallback((event: AchievementsEvent) =>
    {
        const parser = event.getParser();

        const categories: AchievementCategory[] = [];
        
        for(const achievement of parser.achievements)
        {
            const categoryName = achievement.category;

            const existing = categories.find(category => category.name === categoryName);

            if(existing)
            {
                existing.achievements.push(achievement);
                continue;
            }

            const category = new AchievementCategory(categoryName);
            category.achievements.push(achievement);
            categories.push(category);
        }

        dispatchAchievementsState({
            type: AchievementsActions.SET_CATEGORIES,
            payload: {
                categories: categories
            }
        });
    }, [ dispatchAchievementsState ]);

    const onAchievementsScoreEvent = useCallback((event: AchievementsScoreEvent) =>
    {
        const parser = event.getParser();

        dispatchAchievementsState({
            type: AchievementsActions.SET_SCORE,
            payload: {
                score: parser.score
            }
        });

    }, [ dispatchAchievementsState ]);

    CreateMessageHook(AchievementEvent, onAchievementEvent);
    CreateMessageHook(AchievementsEvent, onAchievementsEvent);
    CreateMessageHook(AchievementsScoreEvent, onAchievementsScoreEvent);
    
    return null;
};
