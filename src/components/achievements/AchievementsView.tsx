import { AchievementData, AchievementEvent, AchievementsEvent, AchievementsScoreEvent, RequestAchievementsMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { GetConfiguration, LocalizeText } from '../../api';
import { Base } from '../../common/Base';
import { Column } from '../../common/Column';
import { Flex } from '../../common/Flex';
import { Text } from '../../common/Text';
import { AchievementsUIEvent, AchievementsUIUnseenCountEvent } from '../../events/achievements';
import { BatchUpdates, CreateMessageHook, dispatchUiEvent, SendMessageHook } from '../../hooks';
import { useUiEvent } from '../../hooks/events';
import { NitroCardContentView, NitroCardHeaderView, NitroCardSubHeaderView, NitroCardView } from '../../layout';
import { NitroLayoutBase } from '../../layout/base';
import { AchievementCategory } from './common/AchievementCategory';
import { AchievementUtilities } from './common/AchievementUtilities';
import { AchievementsCategoryListView } from './views/category-list/AchievementsCategoryListView';
import { AchievementCategoryView } from './views/category/AchievementCategoryView';

export const AchievementsView: FC<{}> = props =>
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

    const scaledProgressPercent = useMemo(() =>
    {
        return ~~((((getProgress - 0) * (100 - 0)) / (getMaxProgress - 0)) + 0);
    }, [ getProgress, getMaxProgress ]);

    const getSelectedCategory = useMemo(() =>
    {
        if(!achievementCategories || !achievementCategories.length) return null;

        return achievementCategories.find(existing => (existing.code === selectedCategoryCode));
    }, [ achievementCategories, selectedCategoryCode ]);

    const getCategoryIcon = useMemo(() =>
    {
        if(!getSelectedCategory) return null;
        
        const imageUrl = GetConfiguration<string>('achievements.images.url');

        return imageUrl.replace('%image%', `achicon_${ getSelectedCategory.code }`);
    }, [ getSelectedCategory ]);

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
                <NitroCardSubHeaderView position="relative" className="justify-content-center align-items-center cursor-pointer" gap={ 3 }>
                    <NitroLayoutBase onClick={ event => setSelectedCategoryCode(null) } className="nitro-achievements-back-arrow" />
                    <Column grow gap={ 0 }>
                        <Text fontSize={ 4 } fontWeight="bold" className="text-small">{ LocalizeText(`quests.${ getSelectedCategory.code }.name`) }</Text>
                        <Text>{ LocalizeText('achievements.details.categoryprogress', [ 'progress', 'limit' ], [ getSelectedCategory.getProgress().toString(), getSelectedCategory.getMaxProgress().toString() ]) }</Text>
                    </Column>
                </NitroCardSubHeaderView> }
            <NitroCardContentView>
                { !getSelectedCategory &&
                    <>
                        <AchievementsCategoryListView categories={ achievementCategories } selectedCategoryCode={ selectedCategoryCode } setSelectedCategoryCode={ setSelectedCategoryCode } />
                        <Column grow justifyContent="end">
                            <Base className="progress" position="relative">
                                <Flex fit center position="absolute" className="text-black">{ LocalizeText('achievements.categories.totalprogress', [ 'progress', 'limit' ], [ getProgress.toString(), getMaxProgress.toString() ]) }</Flex>
                                <Base className="progress-bar bg-success" style={ { width: (scaledProgressPercent + '%') }} />
                            </Base>
                            <Text className="bg-muted rounded p-1" center>{ LocalizeText('achievements.categories.score', [ 'score' ], [ achievementScore.toString() ]) }</Text>
                        </Column>
                    </> }
                { getSelectedCategory &&
                    <AchievementCategoryView category={ getSelectedCategory } setAchievementSeen={ setAchievementSeen } /> }
            </NitroCardContentView>
        </NitroCardView>
    );
};
