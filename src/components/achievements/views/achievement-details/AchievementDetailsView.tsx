import { AchievementData } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { LocalizeBadgeDescription, LocalizeBadgeName, LocalizeText } from '../../../../api';
import { Base } from '../../../../common/Base';
import { Column } from '../../../../common/Column';
import { Flex } from '../../../../common/Flex';
import { Text } from '../../../../common/Text';
import { NitroLayoutFlex, NitroLayoutFlexColumn } from '../../../../layout';
import { NitroLayoutBase } from '../../../../layout/base';
import { CurrencyIcon } from '../../../../views/shared/currency-icon/CurrencyIcon';
import { AchievementUtilities } from '../../common/AchievementUtilities';
import { GetAchievementLevel } from '../../common/GetAchievementLevel';
import { GetScaledProgressPercent } from '../../common/GetScaledProgressPercent';
import { AchievementBadgeView } from '../achievement-badge/AchievementBadgeView';

export interface AchievementDetailsViewProps
{
    achievement: AchievementData;
}

export const AchievementDetailsView: FC<AchievementDetailsViewProps> = props =>
{
    const { achievement = null } = props;

    if(!achievement) return null;

    const achievementLevel = GetAchievementLevel(achievement);
    const scaledProgressPercent = GetScaledProgressPercent(achievement);

    return (
        <Flex shrink className="bg-muted rounded p-2 text-black" gap={ 2 } overflow="hidden">
            <Column center>
                <AchievementBadgeView className="nitro-achievements-badge-image" achievement={ achievement } scale={ 2 } />
                <NitroLayoutBase className="fw-bold">
                    { LocalizeText('achievements.details.level', [ 'level', 'limit' ], [ achievementLevel.toString(), achievement.levelCount.toString() ]) }
                </NitroLayoutBase>
            </Column>
            <Column fullWidth justifyContent="center" overflow="hidden">
                <Column gap={ 1 }>
                    <Text fontWeight="bold" truncate>
                        { LocalizeBadgeName(AchievementUtilities.getBadgeCode(achievement)) }
                    </Text>
                    <Text truncate>
                        { LocalizeBadgeDescription(AchievementUtilities.getBadgeCode(achievement)) }
                    </Text>
                </Column>
                { ((achievement.levelRewardPoints > 0) || (achievement.scoreLimit > 0)) &&
                    <NitroLayoutFlexColumn gap={ 1 }>
                        { (achievement.levelRewardPoints > 0) &&
                            <NitroLayoutFlex gap={ 1 }>
                                <NitroLayoutBase className="text-truncate small">
                                    { LocalizeText('achievements.details.reward') }
                                </NitroLayoutBase>
                                <NitroLayoutFlex className="fw-bold align-items-center justify-content-center small" gap={ 1 }>
                                    { achievement.levelRewardPoints }
                                    <CurrencyIcon type={ achievement.levelRewardPointType } />
                                </NitroLayoutFlex>
                            </NitroLayoutFlex> }
                        { (achievement.scoreLimit > 0) &&
                            <Base className="progress" position="relative">
                                <Flex fit center position="absolute" className="text-black"> { LocalizeText('achievements.details.progress', [ 'progress', 'limit' ], [ (achievement.currentPoints + achievement.scoreAtStartOfLevel).toString(), (achievement.scoreLimit + achievement.scoreAtStartOfLevel).toString() ]) }</Flex>
                                <Base className="progress-bar" style={ { width: (scaledProgressPercent + '%') }} />
                            </Base> }
                    </NitroLayoutFlexColumn> }
            </Column>
        </Flex>
    )
}
