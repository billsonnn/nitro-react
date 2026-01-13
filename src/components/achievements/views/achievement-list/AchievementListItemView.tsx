import { AchievementData } from "@nitrots/nitro-renderer"
import { FC } from "react"
import { AchievementUtilities } from "../../../../api"
import { LayoutBadgeImageView } from "../../../../common"
import { useAchievements } from "../../../../hooks"

interface AchievementListItemViewProps
{
    achievement: AchievementData;
}

export const AchievementListItemView: FC<AchievementListItemViewProps> = props =>
{
    const { achievement = null } = props
    const { selectedAchievement = null, setSelectedAchievementId = null } = useAchievements()

    if(!achievement) return null

    return (
        <div className={`illumina-card-item flex h-[50px] w-[52px] cursor-pointer items-center justify-center ${(selectedAchievement === achievement) && "active"}`} onClick={ event => setSelectedAchievementId(achievement.achievementId) }>
            <LayoutBadgeImageView badgeCode={ AchievementUtilities.getAchievementBadgeCode(achievement) } isGrayscale={ !AchievementUtilities.getAchievementHasStarted(achievement) } />
        </div>
    )
}
