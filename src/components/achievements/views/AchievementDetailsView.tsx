import { AchievementData } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { AchievementUtilities, LocalizeBadgeDescription, LocalizeBadgeName, LocalizeText } from '../../../api';
import { Column, Flex, LayoutCurrencyIcon, LayoutProgressBar, Text } from '../../../common';
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
                <AchievementBadgeView className="nitro-achievements-badge-image" achievement={ achievement } scale={ 2 } />
                <Text fontWeight="bold">
                    { LocalizeText('achievements.details.level', [ 'level', 'limit' ], [ AchievementUtilities.getAchievementLevel(achievement).toString(), achievement.levelCount.toString() ]) }
                </Text>
            </Column>
            <Column fullWidth justifyContent="center" overflow="hidden">
                <Column gap={ 1 }>
                    <Text fontWeight="bold" truncate>
                        { LocalizeBadgeName(AchievementUtilities.getAchievementBadgeCode(achievement)) }
                    </Text>
                    <Text textBreak>
                        { LocalizeBadgeDescription(AchievementUtilities.getAchievementBadgeCode(achievement)) }
                    </Text>
                </Column>
                { ((achievement.levelRewardPoints > 0) || (achievement.scoreLimit > 0)) &&
                    <Column gap={ 1 }>
                        { (achievement.levelRewardPoints > 0) &&
                            <Flex alignItems="center" gap={ 1 }>
                                <Text truncate className="small">
                                    { LocalizeText('achievements.details.reward') }
                                </Text>
                                <Flex center className="fw-bold small" gap={ 1 }>
                                    { achievement.levelRewardPoints }
                                    <LayoutCurrencyIcon type={ achievement.levelRewardPointType } />
                                </Flex>
                            </Flex> }
                        { (achievement.scoreLimit > 0) &&
                            <LayoutProgressBar text={ LocalizeText('achievements.details.progress', [ 'progress', 'limit' ], [ (achievement.currentPoints + achievement.scoreAtStartOfLevel).toString(), (achievement.scoreLimit + achievement.scoreAtStartOfLevel).toString() ]) } progress={ (achievement.currentPoints + achievement.scoreAtStartOfLevel) } maxProgress={ (achievement.scoreLimit + achievement.scoreAtStartOfLevel) } /> }
                    </Column> }
            </Column>
        </Flex>
    )
}
