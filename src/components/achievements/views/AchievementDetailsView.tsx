import { AchievementData } from '@nitrots/nitro-renderer';
import { FC, PropsWithChildren } from 'react';
import { GetAchievementBadgeCode, GetAchievementLevel, LocalizeBadgeDescription, LocalizeBadgeName, LocalizeText } from '../../../api';
import { Column, Flex, LayoutCurrencyIcon, LayoutProgressBar, Text } from '../../../common';
import { AchievementBadgeView } from './AchievementBadgeView';

interface AchievementDetailsViewProps
{
    achievement: AchievementData;
}

export const AchievementDetailsView: FC<PropsWithChildren<AchievementDetailsViewProps>> = props =>
{
    const { achievement = null, children = null, ...rest } = props;

    if(!achievement) return null;

    return (
        <Flex shrink className="bg-muted rounded p-2 text-black" gap={ 2 } overflow="hidden" { ...rest }>
            <Column center gap={ 1 }>
                <AchievementBadgeView className="nitro-achievements-badge-image" achievement={ achievement } scale={ 2 } />
                <Text fontWeight="bold">
                    { LocalizeText('achievements.details.level', [ 'level', 'limit' ], [ GetAchievementLevel(achievement).toString(), achievement.levelCount.toString() ]) }
                </Text>
            </Column>
            <Column fullWidth justifyContent="center" overflow="hidden">
                <Column gap={ 1 }>
                    <Text fontWeight="bold" truncate>
                        { LocalizeBadgeName(GetAchievementBadgeCode(achievement)) }
                    </Text>
                    <Text textBreak>
                        { LocalizeBadgeDescription(GetAchievementBadgeCode(achievement)) }
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
            { children }
        </Flex>
    )
}
