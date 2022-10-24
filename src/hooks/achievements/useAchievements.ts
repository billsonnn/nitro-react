import { AchievementData, AchievementEvent, AchievementsEvent, AchievementsScoreEvent, RequestAchievementsMessageComposer } from '@nitrots/nitro-renderer';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useBetween } from 'use-between';
import { AchievementCategory, AchievementUtilities, CloneObject, SendMessageComposer } from '../../api';
import { useMessageEvent } from '../events';

const useAchievementsState = () =>
{
    const [ needsUpdate, setNeedsUpdate ] = useState<boolean>(true);
    const [ achievementCategories, setAchievementCategories ] = useState<AchievementCategory[]>([]);
    const [ selectedCategoryCode, setSelectedCategoryCode ] = useState<string>(null);
    const [ selectedAchievementId, setSelectedAchievementId ] = useState<number>(-1);
    const [ achievementScore, setAchievementScore ] = useState<number>(0);

    const getTotalUnseen = useMemo(() =>
    {
        let unseen = 0;

        achievementCategories.forEach(category => unseen += AchievementUtilities.getAchievementCategoryTotalUnseen(category));

        return unseen;
    }, [ achievementCategories ]);

    const getProgress = useMemo(() =>
    {
        let progress = 0;

        achievementCategories.forEach(category => (progress += category.getProgress()));

        return progress;
    }, [ achievementCategories ]);

    const getMaxProgress = useMemo(() =>
    {
        let progress = 0;

        achievementCategories.forEach(category => (progress += category.getMaxProgress()));

        return progress;
    }, [ achievementCategories ]);

    const scaledProgressPercent = useMemo(() =>
    {
        return ~~((((getProgress - 0) * (100 - 0)) / (getMaxProgress - 0)) + 0);
    }, [ getProgress, getMaxProgress ]);

    const selectedCategory = useMemo(() =>
    {
        if(selectedCategoryCode === null) return null;

        return achievementCategories.find(category => (category.code === selectedCategoryCode));
    }, [ achievementCategories, selectedCategoryCode ]);

    const selectedAchievement = useMemo(() =>
    {
        if((selectedAchievementId === -1) || !selectedCategory) return null;

        return selectedCategory.achievements.find(achievement => (achievement.achievementId === selectedAchievementId));
    }, [ selectedCategory, selectedAchievementId ]);

    const setAchievementSeen = useCallback((categoryCode: string, achievementId: number) =>
    {
        setAchievementCategories(prevValue =>
        {
            const newValue = [ ...prevValue ];

            for(const category of newValue)
            {
                if(category.code !== categoryCode) continue;

                for(const achievement of category.achievements)
                {
                    if(achievement.achievementId !== achievementId) continue;

                    achievement.unseen = 0;
                }
            }

            return newValue;
        });
    }, []);

    useMessageEvent<AchievementEvent>(AchievementEvent, event =>
    {
        const parser = event.getParser();
        const achievement = parser.achievement;

        setAchievementCategories(prevValue =>
        {
            const newValue = [ ...prevValue ];
            const categoryIndex = newValue.findIndex(existing => (existing.code === achievement.category));

            if(categoryIndex === -1)
            {
                const category = new AchievementCategory(achievement.category);

                category.achievements.push(achievement);

                newValue.push(category);
            }
            else
            {
                const category = CloneObject(newValue[categoryIndex]);
                const newAchievements = [ ...category.achievements ];
                const achievementIndex = newAchievements.findIndex(existing => (existing.achievementId === achievement.achievementId));
                let previousAchievement: AchievementData = null;

                if(achievementIndex === -1)
                {
                    newAchievements.push(achievement);
                }
                else
                {
                    previousAchievement = newAchievements[achievementIndex];

                    newAchievements[achievementIndex] = achievement;
                }

                if(!AchievementUtilities.getAchievementIsIgnored(achievement))
                {
                    achievement.unseen++;

                    if(previousAchievement) achievement.unseen += previousAchievement.unseen;
                }

                category.achievements = newAchievements;

                newValue[categoryIndex] = category;
            }

            return newValue;
        });
    });

    useMessageEvent<AchievementsEvent>(AchievementsEvent, event =>
    {
        const parser = event.getParser();
        const categories: AchievementCategory[] = [];
        
        for(const achievement of parser.achievements)
        {
            const categoryName = achievement.category;

            let existing = categories.find(category => (category.code === categoryName));

            if(!existing)
            {
                existing = new AchievementCategory(categoryName);

                categories.push(existing);
            }

            existing.achievements.push(achievement);
        }

        setAchievementCategories(categories);
    });

    useMessageEvent<AchievementsScoreEvent>(AchievementsScoreEvent, event =>
    {
        const parser = event.getParser();

        setAchievementScore(parser.score);
    });

    useEffect(() =>
    {
        if(!needsUpdate) return;

        SendMessageComposer(new RequestAchievementsMessageComposer());

        setNeedsUpdate(false);
    }, [ needsUpdate ]);

    return { achievementCategories, selectedCategoryCode, setSelectedCategoryCode, selectedAchievementId, setSelectedAchievementId, achievementScore, getTotalUnseen, getProgress, getMaxProgress, scaledProgressPercent, selectedCategory, selectedAchievement, setAchievementSeen };
}

export const useAchievements = () => useBetween(useAchievementsState);
