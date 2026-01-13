import { AchievementData } from "@nitrots/nitro-renderer"
import { FC } from "react"
import { AchievementUtilities, LocalizeBadgeDescription, LocalizeBadgeName, LocalizeText } from "../../../api"
import { LayoutBadgeImageView } from "../../../common"

interface AchievementDetailsViewProps
{
    achievement: AchievementData;
}

export const AchievementDetailsView: FC<AchievementDetailsViewProps> = props =>
{
    const { achievement = null } = props

    if(!achievement) return null

    return (
        <div className="flex h-[114px] pr-[7px]">
            <div className="mr-[5px]">
                <div className="flex size-[72px] items-center justify-center bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-390px_-212px]">
                    <LayoutBadgeImageView className="scale-250" badgeCode={ AchievementUtilities.getAchievementBadgeCode(achievement) } isGrayscale={ !AchievementUtilities.getAchievementHasStarted(achievement) } />
                </div>
            </div>
            <div className="flex w-full flex-col">
                <div className="flex h-full flex-col">
                    <p className="mb-2 text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">
                        { LocalizeBadgeName(AchievementUtilities.getAchievementBadgeCode(achievement)) }
                    </p>
                    <p className="mb-[13px] text-sm">
                        { LocalizeBadgeDescription(AchievementUtilities.getAchievementBadgeCode(achievement)) }
                    </p>
                    <p className="text-sm">
                        {LocalizeText("resolution.achievement.level")} <b className="font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{AchievementUtilities.getAchievementLevel(achievement).toString()}/{achievement.levelCount.toString()}</b>
                    </p>
                </div>
                { (achievement.scoreLimit > 0) &&
                    <div className="w-full pt-1.5">
                        <div className="illumina-card-item illumina-achievements-progress-bar relative flex h-[23px] items-center justify-center p-1">
                            <div className="size-full">
                                <div className="illumina-achievements-progress-bar-percent h-full" style={ { width: (~~(((((achievement.currentPoints + achievement.scoreAtStartOfLevel) - 0) * (100 - 0)) / ((achievement.scoreLimit + achievement.scoreAtStartOfLevel) - 0)) + 0) + "%") } } />
                            </div>
                            <p className="absolute text-center text-xs font-semibold">{(achievement.currentPoints + achievement.scoreAtStartOfLevel).toString() + "/" + (achievement.scoreLimit + achievement.scoreAtStartOfLevel).toString() }</p>
                        </div>
                    </div> }
            </div>
        </div>
    )
}
