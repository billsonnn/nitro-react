import { AchievementData, AchievementEvent, AchievementsEvent, AchievementsScoreEvent, ILinkEventTracker, RequestAchievementsMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { AchievementCategory, AddEventLinkTracker, CloneObject, GetAchievementCategoryImageUrl, GetAchievementIsIgnored, LocalizeText, RemoveLinkEventTracker, SendMessageComposer } from '../../api';
import { Base, Column, LayoutImage, LayoutProgressBar, NitroCardContentView, NitroCardHeaderView, NitroCardSubHeaderView, NitroCardView, Text } from '../../common';
import { AchievementsUIUnseenCountEvent } from '../../events';
import { BatchUpdates, DispatchUiEvent, UseMessageEventHook } from '../../hooks';
import { AchievementCategoryView } from './views/AchievementCategoryView';
import { AchievementsCategoryListView } from './views/category-list/AchievementsCategoryListView';

export const AchievementsView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const [ isInitalized, setIsInitalized ] = useState(false);
    const [ achievementCategories, setAchievementCategories ] = useState<AchievementCategory[]>([]);
    const [ selectedCategoryCode, setSelectedCategoryCode ] = useState<string>(null);
    const [ achievementScore, setAchievementScore ] = useState(0);

    const onAchievementEvent = useCallback((event: AchievementEvent) =>
    {
        const parser = event.getParser();
        const achievement = parser.achievement;
        const categoryName = achievement.category;

        setAchievementCategories(prevValue =>
            {
                const newValue = [ ...prevValue ];
                const categoryIndex = newValue.findIndex(existing => (existing.code === categoryName));

                if(categoryIndex === -1)
                {
                    const category = new AchievementCategory(categoryName);

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

                    if(!GetAchievementIsIgnored(achievement))
                    {
                        achievement.unseen++;

                        if(previousAchievement) achievement.unseen += previousAchievement.unseen;
                    }

                    category.achievements = newAchievements;

                    newValue[categoryIndex] = category;
                }

                return newValue;
            });
    }, []);

    UseMessageEventHook(AchievementEvent, onAchievementEvent);

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

    UseMessageEventHook(AchievementsEvent, onAchievementsEvent);

    const onAchievementsScoreEvent = useCallback((event: AchievementsScoreEvent) =>
    {
        const parser = event.getParser();

        setAchievementScore(parser.score);
    }, []);

    UseMessageEventHook(AchievementsScoreEvent, onAchievementsScoreEvent);

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

    const scaledProgressPercent = useMemo(() =>
    {
        return ~~((((getProgress - 0) * (100 - 0)) / (getMaxProgress - 0)) + 0);
    }, [ getProgress, getMaxProgress ]);

    const getSelectedCategory = useMemo(() =>
    {
        if(!achievementCategories || !achievementCategories.length) return null;

        return achievementCategories.find(existing => (existing.code === selectedCategoryCode));
    }, [ achievementCategories, selectedCategoryCode ]);

    const setAchievementSeen = useCallback((code: string, achievementId: number) =>
    {
        setAchievementCategories(prevValue =>
            {
                const newValue = [ ...prevValue ];

                for(const category of newValue)
                {
                    if(category.code !== code) continue;

                    for(const achievement of category.achievements)
                    {
                        if(achievement.achievementId !== achievementId) continue;

                        achievement.unseen = 0;
                    }
                }

                return newValue;
            });
    }, []);

    const linkReceived = useCallback((url: string) =>
    {
        const parts = url.split('/');

        if(parts.length < 2) return;

        switch(parts[1])
        {
            case 'show':
                setIsVisible(true);
                return;
            case 'hide':
                setIsVisible(false);
                return;
            case 'toggle':
                setIsVisible(prevValue => !prevValue);
                return;
        }
    }, []);

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived,
            eventUrlPrefix: 'achievements/'
        };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, [ linkReceived ]);

    useEffect(() =>
    {
        if(!isVisible || isInitalized) return;

        SendMessageComposer(new RequestAchievementsMessageComposer());
    }, [ isVisible, isInitalized ]);

    useEffect(() =>
    {
        DispatchUiEvent(new AchievementsUIUnseenCountEvent(getTotalUnseen));
    }, [ getTotalUnseen ]);

    if(!isVisible || !isInitalized) return null;

    return (
        <NitroCardView uniqueKey="achievements" className="nitro-achievements" theme="primary-slim">
            <NitroCardHeaderView headerText={ LocalizeText('inventory.achievements') } onCloseClick={ event => setIsVisible(false) } />
            { getSelectedCategory &&
                <NitroCardSubHeaderView position="relative" className="justify-content-center align-items-center cursor-pointer" gap={ 3 }>
                    <Base onClick={ event => setSelectedCategoryCode(null) } className="nitro-achievements-back-arrow" />
                    <Column grow gap={ 0 }>
                        <Text fontSize={ 4 } fontWeight="bold" className="text-small">{ LocalizeText(`quests.${ getSelectedCategory.code }.name`) }</Text>
                        <Text>{ LocalizeText('achievements.details.categoryprogress', [ 'progress', 'limit' ], [ getSelectedCategory.getProgress().toString(), getSelectedCategory.getMaxProgress().toString() ]) }</Text>
                    </Column>
                    <LayoutImage imageUrl={ GetAchievementCategoryImageUrl(getSelectedCategory, null,true) } />
                </NitroCardSubHeaderView> }
            <NitroCardContentView gap={ 1 }>
                { !getSelectedCategory &&
                    <>
                        <AchievementsCategoryListView categories={ achievementCategories } selectedCategoryCode={ selectedCategoryCode } setSelectedCategoryCode={ setSelectedCategoryCode } />
                        <Column grow justifyContent="end" gap={ 1 }>
                            <Text small center>{ LocalizeText('achievements.categories.score', [ 'score' ], [ achievementScore.toString() ]) }</Text>
                            <LayoutProgressBar text={ LocalizeText('achievements.categories.totalprogress', [ 'progress', 'limit' ], [ getProgress.toString(), getMaxProgress.toString() ]) } progress={ getProgress } maxProgress={ getMaxProgress } />
                        </Column>
                    </> }
                { getSelectedCategory &&
                    <AchievementCategoryView category={ getSelectedCategory } setAchievementSeen={ setAchievementSeen } /> }
            </NitroCardContentView>
        </NitroCardView>
    );
};
