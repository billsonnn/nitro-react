import { AchievementData, AchievementEvent, AchievementsEvent, AchievementsScoreEvent, RequestAchievementsMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { LocalizeText } from '../../api';
import { AchievementsUIEvent, AchievementsUIUnseenCountEvent } from '../../events/achievements';
import { BatchUpdates, CreateMessageHook, dispatchUiEvent, SendMessageHook } from '../../hooks';
import { useUiEvent } from '../../hooks/events';
import { NitroCardContentView, NitroCardHeaderView, NitroCardSubHeaderView, NitroCardView, NitroLayoutFlexColumn, NitroLayoutGrid, NitroLayoutGridColumn } from '../../layout';
import { NitroLayoutBase } from '../../layout/base';
import { AchievementsViewProps } from './AchievementsView.types';
import { AchievementCategory } from './common/AchievementCategory';
import { AchievementUtilities } from './common/AchievementUtilities';
import { AchievementsCategoryListView } from './views/category-list/AchievementsCategoryListView';
import { AchievementCategoryView } from './views/category/AchievementCategoryView';

export const AchievementsView: FC<AchievementsViewProps> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const [ isInitalized, setIsInitalized ] = useState(false);
    const [ achievementCategories, setAchievementCategories ] = useState<AchievementCategory[]>([]);
    const [ selectedCategoryCode, setSelectedCategoryCode ] = useState<string>(null);
    const [ achievementScore, setAchievementScore ] = useState(0);

    const onAchievementsUIEvent = useCallback((event: AchievementsUIEvent) =>
    {
        switch(event.type)
        {
            case AchievementsUIEvent.SHOW_ACHIEVEMENTS:
                setIsVisible(true);
                return;
            case AchievementsUIEvent.HIDE_ACHIEVEMENTS:
                setIsVisible(false);
                return;   
            case AchievementsUIEvent.TOGGLE_ACHIEVEMENTS:
                setIsVisible(value => !value);
                return;
        }
    }, []);

    useUiEvent(AchievementsUIEvent.SHOW_ACHIEVEMENTS, onAchievementsUIEvent);
    useUiEvent(AchievementsUIEvent.HIDE_ACHIEVEMENTS, onAchievementsUIEvent);
    useUiEvent(AchievementsUIEvent.TOGGLE_ACHIEVEMENTS, onAchievementsUIEvent);

    const onAchievementEvent = useCallback((event: AchievementEvent) =>
    {
        const parser = event.getParser();
        const achievement = parser.achievement;
        const newCategories = [ ...achievementCategories ];
        const categoryName = achievement.category;
        const categoryIndex = newCategories.findIndex(existing => (existing.code === categoryName));

        if(categoryIndex === -1)
        {
            const category = new AchievementCategory(categoryName);

            category.achievements.push(achievement);

            newCategories.push(category);
        }
        else
        {
            const category = newCategories[categoryIndex];
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

            if(!AchievementUtilities.isIgnoredAchievement(achievement))
            {
                achievement.unseen++;

                if(previousAchievement) achievement.unseen += previousAchievement.unseen;
            }

            category.achievements = newAchievements;
        }

        setAchievementCategories(newCategories);
    }, [ achievementCategories ]);

    CreateMessageHook(AchievementEvent, onAchievementEvent);

    const onAchievementsEvent = useCallback((event: AchievementsEvent) =>
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

        BatchUpdates(() =>
        {
            setAchievementCategories(categories);
            setIsInitalized(true);
        });
    }, []);

    CreateMessageHook(AchievementsEvent, onAchievementsEvent);

    const onAchievementsScoreEvent = useCallback((event: AchievementsScoreEvent) =>
    {
        const parser = event.getParser();

        setAchievementScore(parser.score);
    }, []);

    CreateMessageHook(AchievementsScoreEvent, onAchievementsScoreEvent);

    const getTotalUnseen = useMemo(() =>
    {
        let unseen = 0;

        for(const category of achievementCategories)
        {
            for(const achievement of category.achievements) unseen += achievement.unseen;
        }

        return unseen;
    }, [ achievementCategories ]);

    const getProgress = useMemo(() =>
    {
        let progress = 0;

        for(const category of achievementCategories) progress += category.getProgress();

        return progress;
    }, [ achievementCategories ]);

    const getMaxProgress = useMemo(() =>
    {
        let progress = 0;

        for(const category of achievementCategories) progress += category.getMaxProgress();

        return progress;
    }, [ achievementCategories ]);

    const getSelectedCategory = useMemo(() =>
    {
        if(!achievementCategories || !achievementCategories.length) return null;

        return achievementCategories.find(existing => (existing.code === selectedCategoryCode));
    }, [ achievementCategories, selectedCategoryCode ]);

    const setAchievementSeen = useCallback((code: string, achievementId: number) =>
    {
        const newCategories = [ ...achievementCategories ];

        for(const category of newCategories)
        {
            if(category.code !== code) continue;

            for(const achievement of category.achievements)
            {
                if(achievement.achievementId !== achievementId) continue;

                achievement.unseen = 0;
            }
        }

        setAchievementCategories(newCategories);
    }, [ achievementCategories ]);

    useEffect(() =>
    {
        if(!isVisible || !isInitalized) return;

        SendMessageHook(new RequestAchievementsMessageComposer());
    }, [ isVisible, isInitalized ]);

    useEffect(() =>
    {
        dispatchUiEvent(new AchievementsUIUnseenCountEvent(getTotalUnseen));
    }, [ getTotalUnseen ]);

    if(!isVisible || !isInitalized) return null;

    return (
        <NitroCardView uniqueKey="achievements" className="nitro-achievements" simple={ true }>
            <NitroCardHeaderView headerText={ LocalizeText('inventory.achievements') } onCloseClick={ event => setIsVisible(false) } />
            { getSelectedCategory &&
                <NitroCardSubHeaderView className="justify-content-center align-items-center cursor-pointer" gap={ 3 }>
                    <NitroLayoutBase onClick={ event => setSelectedCategoryCode(null) } className="nitro-achievements-back-arrow" />
                    <NitroLayoutFlexColumn className="flex-grow-1">
                        <NitroLayoutBase className="fs-4 text-black fw-bold">
                            { LocalizeText(`quests.${ getSelectedCategory.code }.name`) }
                        </NitroLayoutBase>
                        <NitroLayoutBase className="text-black">
                            { LocalizeText('achievements.details.categoryprogress', [ 'progress', 'limit' ], [ getSelectedCategory.getProgress().toString(), getSelectedCategory.getMaxProgress().toString() ]) }
                        </NitroLayoutBase>
                    </NitroLayoutFlexColumn>
                </NitroCardSubHeaderView> }
            <NitroCardContentView>
                <NitroLayoutGrid>
                    <NitroLayoutGridColumn size={ 12 }>
                        { !getSelectedCategory &&
                            <>
                                <AchievementsCategoryListView categories={ achievementCategories } selectedCategoryCode={ selectedCategoryCode } setSelectedCategoryCode={ setSelectedCategoryCode }  />
                                <NitroLayoutFlexColumn className="flex-grow-1 justify-content-end" gap={ 2 }>
                                    <NitroLayoutBase className="bg-muted text-black text-center rounded">
                                        { LocalizeText('achievements.categories.totalprogress', [ 'progress', 'limit' ], [ getProgress.toString(), getMaxProgress.toString() ]) }
                                    </NitroLayoutBase>
                                    <NitroLayoutBase className="bg-muted text-black text-center rounded">
                                        { LocalizeText('achievements.categories.score', [ 'score' ], [ achievementScore.toString() ]) }
                                    </NitroLayoutBase>
                                </NitroLayoutFlexColumn>
                            </> }
                        { getSelectedCategory &&
                            <AchievementCategoryView category={ getSelectedCategory } setAchievementSeen={ setAchievementSeen } /> }
                    </NitroLayoutGridColumn>
                </NitroLayoutGrid>
            </NitroCardContentView>
        </NitroCardView>
    );
};
