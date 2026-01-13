import { Dispatch, FC, SetStateAction } from "react"
import { AchievementUtilities, IAchievementCategory, LocalizeText } from "../../../../api"
import { LayoutItemCountView } from "../../../../common"

interface AchievementCategoryListItemViewProps
{
    category: IAchievementCategory;
    selectedCategoryCode: string;
    setSelectedCategoryCode: Dispatch<SetStateAction<string>>;
}

export const AchievementsCategoryListItemView: FC<AchievementCategoryListItemViewProps> = props =>
{
    const { category = null, selectedCategoryCode = null, setSelectedCategoryCode = null } = props

    if(!category) return null

    const progress = AchievementUtilities.getAchievementCategoryProgress(category)
    const maxProgress = AchievementUtilities.getAchievementCategoryMaxProgress(category)
    const getCategoryImage = AchievementUtilities.getAchievementCategoryImageUrl(category, progress)
    const getTotalUnseen = AchievementUtilities.getAchievementCategoryTotalUnseen(category)

    return (
        <div className="illumina-card-item relative h-[103px] w-[110px] cursor-pointer pt-[31px] hover:-translate-x-px hover:-translate-y-px hover:drop-shadow-[0.5px_0.5px_0_#00000025]" onClick={ event => setSelectedCategoryCode(category.code) }>
            <p className="absolute top-2.5 w-full truncate text-clip text-center text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText(`quests.${ category.code }.name`) }</p>
            <div className="relative size-full bg-top bg-no-repeat" style={{ backgroundImage: `url(${getCategoryImage})` }}>
                <p className="absolute bottom-2.5 w-full text-center text-xs font-semibold text-white">{ progress }/{ maxProgress }</p>
            </div>
            { (getTotalUnseen > 0) && <LayoutItemCountView count={ getTotalUnseen } /> }
        </div>
    )
}
