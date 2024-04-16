import { AddLinkEventTracker, ILinkEventTracker, RemoveLinkEventTracker } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { AchievementUtilities, LocalizeText } from '../../api';
import { Column, LayoutImage, LayoutProgressBar, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../common';
import { useAchievements } from '../../hooks';
import { AchievementCategoryView } from './views/AchievementCategoryView';
import { AchievementsCategoryListView } from './views/category-list/AchievementsCategoryListView';

export const AchievementsView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const { achievementCategories = [], selectedCategoryCode = null, setSelectedCategoryCode = null, achievementScore = 0, getProgress = 0, getMaxProgress = 0, selectedCategory = null } = useAchievements();

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived: (url: string) =>
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
            },
            eventUrlPrefix: 'achievements/'
        };

        AddLinkEventTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, []);

    if(!isVisible) return null;

    return (
        <NitroCardView className="nitro-achievements" theme="primary-slim" uniqueKey="achievements">
            <NitroCardHeaderView headerText={ LocalizeText('inventory.achievements') } onCloseClick={ event => setIsVisible(false) } />
            { selectedCategory &&
                <div className="relative gap-3 justify-center items-center cursor-pointer">
                    <div className="nitro-achievements-back-arrow" onClick={ event => setSelectedCategoryCode(null) } />
                    <Column className="flex-grow-1" gap={ 0 }>
                        <Text className="text-small" fontSize={ 4 } fontWeight="bold">{ LocalizeText(`quests.${ selectedCategory.code }.name`) }</Text>
                        <Text>{ LocalizeText('achievements.details.categoryprogress', [ 'progress', 'limit' ], [ selectedCategory.getProgress().toString(), selectedCategory.getMaxProgress().toString() ]) }</Text>
                    </Column>
                    <LayoutImage imageUrl={ AchievementUtilities.getAchievementCategoryImageUrl(selectedCategory, null,true) } />
                </div> }
            <NitroCardContentView gap={ 1 }>
                { !selectedCategory &&
                    <>
                        <AchievementsCategoryListView categories={ achievementCategories } selectedCategoryCode={ selectedCategoryCode } setSelectedCategoryCode={ setSelectedCategoryCode } />
                        <Column className="flex-grow-1" gap={ 1 } justifyContent="end">
                            <Text center small>{ LocalizeText('achievements.categories.score', [ 'score' ], [ achievementScore.toString() ]) }</Text>
                            <LayoutProgressBar maxProgress={ getMaxProgress } progress={ getProgress } text={ LocalizeText('achievements.categories.totalprogress', [ 'progress', 'limit' ], [ getProgress.toString(), getMaxProgress.toString() ]) } />
                        </Column>
                    </> }
                { selectedCategory &&
                    <AchievementCategoryView category={ selectedCategory } /> }
            </NitroCardContentView>
        </NitroCardView>
    );
};
