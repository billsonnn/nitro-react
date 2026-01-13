import { AchievementData } from "@nitrots/nitro-renderer"
import { FC } from "react"
import { AchievementListItemView } from "./AchievementListItemView"

interface AchievementListViewProps
{
    achievements: AchievementData[];
}

export const AchievementListView: FC<AchievementListViewProps> = props =>
{
    const { achievements = null } = props

    return (
        <div className="illumina-scrollbar mb-[18px] grid h-[162px] max-h-[162px] grid-cols-[repeat(auto-fit,minmax(50px,0fr))] grid-rows-[max-content] gap-1.5">
            { achievements && (achievements.length > 0) && achievements.map((achievement, index) => <AchievementListItemView key={ index } achievement={ achievement } />) }
        </div>
    )
}
