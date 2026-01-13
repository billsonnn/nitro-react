import { FC, useEffect } from "react"
import { AchievementCategory } from "../../../api"
import { useAchievements } from "../../../hooks"
import { AchievementDetailsView } from "./AchievementDetailsView"
import { AchievementListView } from "./achievement-list"

interface AchievementCategoryViewProps
{
    category: AchievementCategory;
}

export const AchievementCategoryView: FC<AchievementCategoryViewProps> = props =>
{
    const { category = null } = props
    const { selectedAchievement = null, setSelectedAchievementId = null } = useAchievements()

    useEffect(() =>
    {
        if(!category) return

        if(!selectedAchievement)
        {
            setSelectedAchievementId(category?.achievements?.[0]?.achievementId)
        }
    }, [ category, selectedAchievement, setSelectedAchievementId ])

    if(!category) return null

    return (
        <div className="illumina-achievements-body flex h-full flex-col justify-between py-2 pl-2.5 pr-[5px]">
            <AchievementListView achievements={ category.achievements } />
            { !!selectedAchievement &&
                <AchievementDetailsView achievement={ selectedAchievement } /> }
        </div>
    )
}
