import { FC, useMemo } from 'react';
import { LocalizeBadgeDescription, LocalizeBadgeName, LocalizeText } from '../../../../api';
import { NitroLayoutFlex, NitroLayoutFlexColumn } from '../../../../layout';
import { NitroLayoutBase } from '../../../../layout/base';
import { CurrencyIcon } from '../../../shared/currency-icon/CurrencyIcon';
import { AchievementUtilities } from '../../common/AchievementUtilities';
import { AchievementBadgeView } from '../achievement-badge/AchievementBadgeView';
import { AchievementDetailsViewProps } from './AchievementDetailsView.types';

export const AchievementDetailsView: FC<AchievementDetailsViewProps> = props =>
{
    const { achievement = null } = props;

    const getAchievementLevel = useMemo(() =>
    {
        if(achievement.finalLevel) return achievement.level;

        return (achievement.level - 1);
    }, [ achievement ]);

    if(!achievement) return null;

    const currentAmount = achievement.currentPoints;
    const maxAmount = achievement.scoreLimit;
    const scoreAtStartOfLevel = achievement.scoreAtStartOfLevel;

    return (
        <NitroLayoutFlex className="bg-muted rounded p-2 text-black flex-shrink-0" gap={ 2 } overflow="hidden">
            <NitroLayoutFlexColumn className="justify-content-center align-items-center">
                <AchievementBadgeView className="nitro-achievements-badge-image" achievement={ achievement } scale={ 2 } />
                <NitroLayoutBase className="fw-bold">
                    { LocalizeText('achievements.details.level', [ 'level', 'limit' ], [ getAchievementLevel.toString(), achievement.levelCount.toString() ]) }
                    </NitroLayoutBase>
            </NitroLayoutFlexColumn>
            <NitroLayoutFlexColumn className="justify-content-center w-100" overflow="hidden" gap={ 2 }>
                <NitroLayoutFlexColumn>
                    <NitroLayoutBase className="fw-bold text-truncate">
                        { LocalizeBadgeName(AchievementUtilities.getBadgeCode(achievement)) }
                    </NitroLayoutBase>
                    <NitroLayoutBase className="text-truncate">
                        { LocalizeBadgeDescription(AchievementUtilities.getBadgeCode(achievement)) }
                    </NitroLayoutBase>
                </NitroLayoutFlexColumn>
                { ((achievement.levelRewardPoints > 0) || (maxAmount > 0)) &&
                    <NitroLayoutFlexColumn gap={ 1 }>
                        { (achievement.levelRewardPoints > 0) &&
                            <NitroLayoutFlex gap={ 1 }>
                                <NitroLayoutBase className="text-truncate">
                                    { LocalizeText('achievements.details.reward') }
                                </NitroLayoutBase>
                                <NitroLayoutFlex className="fw-bold align-items-center justify-content-center" gap={ 1 }>
                                    { achievement.levelRewardPoints }
                                    <CurrencyIcon type={ achievement.levelRewardPointType } />
                                </NitroLayoutFlex>
                            </NitroLayoutFlex> }
                        { (maxAmount > 0) &&
                            LocalizeText('achievements.details.progress', [ 'progress', 'limit' ], [ (currentAmount + scoreAtStartOfLevel).toString(), (maxAmount + scoreAtStartOfLevel).toString() ]) }
                    </NitroLayoutFlexColumn> }
            </NitroLayoutFlexColumn>
        </NitroLayoutFlex>
    )
}
