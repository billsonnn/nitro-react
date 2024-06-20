import
{
    AddLinkEventTracker,
    ILinkEventTracker,
    RemoveLinkEventTracker,
} from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { AchievementUtilities, LocalizeText } from '../../api';
import { Column, LayoutImage, LayoutProgressBar, Text } from '../../common';
import { useAchievements } from '../../hooks';
import { NitroCard } from '../../layout';
import { AchievementCategoryView } from './AchievementCategoryView';
import { AchievementsCategoryListView } from './category-list';

export const AchievementsView: FC<{}> = (props) =>
{
    const [isVisible, setIsVisible] = useState(false);
    const {
        achievementCategories = [],
        selectedCategoryCode = null,
        setSelectedCategoryCode = null,
        achievementScore = 0,
        getProgress = 0,
        getMaxProgress = 0,
        selectedCategory = null,
    } = useAchievements();

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
                        setIsVisible((prevValue) => !prevValue);
                        return;
                }
            },
            eventUrlPrefix: 'achievements/',
        };

        AddLinkEventTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, []);

    if(!isVisible) return null;

    return (
        <NitroCard className="w-[375px] h-[405px]" uniqueKey="achievements">
            <NitroCard.Header
                headerText={LocalizeText('inventory.achievements')}
                onCloseClick={(event) => setIsVisible(false)}
            />
            {selectedCategory && (
                <div className="relative flex items-center justify-center gap-3 p-1 cursor-pointer container-fluid bg-muted">
                    <div
                        className="bg-[url('@/assets/images/achievements/back-arrow.png')] bg-center no-repeat w-[33px] h-[34px]"
                        onClick={(event) => setSelectedCategoryCode(null)}
                    />
                    <Column className="!flex-grow" gap={0}>
                        <Text
                            className="text-small"
                            fontSize={4}
                            fontWeight="bold"
                        >
                            {LocalizeText(
                                `quests.${selectedCategory.code}.name`
                            )}
                        </Text>
                        <Text>
                            {LocalizeText(
                                'achievements.details.categoryprogress',
                                ['progress', 'limit'],
                                [
                                    selectedCategory.getProgress().toString(),
                                    selectedCategory
                                        .getMaxProgress()
                                        .toString(),
                                ]
                            )}
                        </Text>
                    </Column>
                    <LayoutImage
                        imageUrl={AchievementUtilities.getAchievementCategoryImageUrl(
                            selectedCategory,
                            null,
                            true
                        )}
                    />
                </div>
            )}
            <NitroCard.Content>
                {!selectedCategory && (
                    <>
                        <AchievementsCategoryListView
                            categories={achievementCategories}
                            selectedCategoryCode={selectedCategoryCode}
                            setSelectedCategoryCode={setSelectedCategoryCode}
                        />
                        <div
                            className="flex flex-col justify-end flex-grow gap-1"
                        >
                            <Text center small>
                                {LocalizeText(
                                    'achievements.categories.score',
                                    ['score'],
                                    [achievementScore.toString()]
                                )}
                            </Text>
                            <LayoutProgressBar
                                maxProgress={getMaxProgress}
                                progress={getProgress}
                                text={LocalizeText(
                                    'achievements.categories.totalprogress',
                                    ['progress', 'limit'],
                                    [
                                        getProgress.toString(),
                                        getMaxProgress.toString(),
                                    ]
                                )}
                            />
                        </div>
                    </>
                )}
                {selectedCategory && (
                    <AchievementCategoryView category={selectedCategory} />
                )}
            </NitroCard.Content>
        </NitroCard>
    );
};
