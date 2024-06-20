import { AchievementData } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { AchievementUtilities, LocalizeBadgeDescription, LocalizeBadgeName, LocalizeText } from '../../api';
import { Column, Flex, LayoutCurrencyIcon, LayoutProgressBar, Text } from '../../common';
import { AchievementBadgeView } from './AchievementBadgeView';

interface AchievementDetailsViewProps
{
    achievement: AchievementData;
}

export const AchievementDetailsView: FC<AchievementDetailsViewProps> = props =>
{
    const { achievement = null } = props;

    if(!achievement) return null;

    return (
        <Flex shrink className="bg-muted rounded p-2 text-black" gap={ 2 } overflow="hidden">
            <Column center gap={ 1 }>
                <AchievementBadgeView achievement={ achievement } className="nitro-achievements-relative w-[40px] h-[40px] bg-no-repeat bg-center" scale={ 2 } />
                <Text fontWeight="bold">
                    { LocalizeText('achievements.details.level', [ 'level', 'limit' ], [ AchievementUtilities.getAchievementLevel(achievement).toString(), achievement.levelCount.toString() ]) }
                </Text>
            </Column>
            <Column fullWidth justifyContent="center" overflow="hidden">
                <div className="flex flex-col gap-1">
                    <Text truncate fontWeight="bold">
                        { LocalizeBadgeName(AchievementUtilities.getAchievementBadgeCode(achievement)) }
                    </Text>
                    <Text textBreak>
                        { LocalizeBadgeDescription(AchievementUtilities.getAchievementBadgeCode(achievement)) }
                    </Text>
                </div>
                { ((achievement.levelRewardPoints > 0) || (achievement.scoreLimit > 0)) &&
                    <div className="flex flex-col gap-1">
                        { (achievement.levelRewardPoints > 0) &&
                            <div className="flex items-center gap-1">
                                <Text truncate className="small">
                                    { LocalizeText('achievements.details.reward') }
                                </Text>
                                <Flex center className="font-bold	 small" gap={ 1 }>
                                    { achievement.levelRewardPoints }
                                    <LayoutCurrencyIcon type={ achievement.levelRewardPointType } />
                                </Flex>
                            </div> }
                        { (achievement.scoreLimit > 0) &&
                            <LayoutProgressBar maxProgress={ (achievement.scoreLimit + achievement.scoreAtStartOfLevel) } progress={ (achievement.currentPoints + achievement.scoreAtStartOfLevel) } text={ LocalizeText('achievements.details.progress', [ 'progress', 'limit' ], [ (achievement.currentPoints + achievement.scoreAtStartOfLevel).toString(), (achievement.scoreLimit + achievement.scoreAtStartOfLevel).toString() ]) } /> }
                    </div> }
            </Column>
        </Flex>
    );
};
