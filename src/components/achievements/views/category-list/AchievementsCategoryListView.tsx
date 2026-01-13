import { Dispatch, FC, SetStateAction } from "react"
import { IAchievementCategory } from "../../../../api"
import { AchievementsCategoryListItemView } from "./AchievementsCategoryListItemView"

interface AchievementsCategoryListViewProps
{
    categories: IAchievementCategory[];
    selectedCategoryCode: string;
    setSelectedCategoryCode: Dispatch<SetStateAction<string>>;
}

export const AchievementsCategoryListView: FC<AchievementsCategoryListViewProps> = props =>
{
    const { categories = null, selectedCategoryCode = null, setSelectedCategoryCode = null } = props
    
    return (
        <div className="grid grid-cols-3 gap-2.5 pt-px">
            { categories && (categories.length > 0) && categories.map((category, index) => <AchievementsCategoryListItemView key={ index } category={ category } selectedCategoryCode={ selectedCategoryCode } setSelectedCategoryCode={ setSelectedCategoryCode } />) }
        </div>
    )
}
