import { ILinkEventTracker } from "@nitrots/nitro-renderer"
import { FC, useEffect, useState } from "react"
import { AchievementUtilities, AddEventLinkTracker, LocalizeText, RemoveLinkEventTracker } from "../../api"
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from "../../common"
import { useAchievements } from "../../hooks"
import { AchievementCategoryView } from "./views/AchievementCategoryView"
import { AchievementsCategoryListView } from "./views/category-list/AchievementsCategoryListView"

export const AchievementsView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false)
    const { achievementCategories = [], selectedCategoryCode = null, setSelectedCategoryCode = null, achievementScore = 0, getProgress = 0, getMaxProgress = 0, selectedCategory = null } = useAchievements()

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived: (url: string) =>
            {
                const parts = url.split("/")
        
                if(parts.length < 2) return
        
                switch(parts[1])
                {
                case "show":
                    setIsVisible(true)
                    return
                case "hide":
                    setIsVisible(false)
                    return
                case "toggle":
                    setIsVisible(prevValue => !prevValue)
                    return
                }
            },
            eventUrlPrefix: "achievements/"
        }

        AddEventLinkTracker(linkTracker)

        return () => RemoveLinkEventTracker(linkTracker)
    }, [])

    if(!isVisible) return null

    return (
        <NitroCardView uniqueKey="achievements" className="illumina-achievements h-[420px] min-h-[430px] w-[392px]">
            <NitroCardHeaderView headerText={ LocalizeText("inventory.achievements") } onCloseClick={ event => setIsVisible(false) } />
            <NitroCardContentView className="h-full !overflow-auto">
                { selectedCategory && <>
                    <div className="relative flex w-full items-center justify-between">
                        <div className="flex">
                            <i className="mr-6 block h-[34px] w-[33px] cursor-pointer bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-429px_-146px]" onClick={ event => setSelectedCategoryCode(null) } />
                            <div className="">
                                <p className="mb-[9px] text-lg font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText(`quests.${ selectedCategory.code }.name`) }</p>
                                <p className="text-sm">{ LocalizeText("achievements.details.categoryprogress", [ "progress", "limit" ], [ selectedCategory.getProgress().toString(), selectedCategory.getMaxProgress().toString() ]) }</p>
                            </div>
                        </div>
                        <div className="h-[54px] w-[52px]" style={{ backgroundImage: `url(${ AchievementUtilities.getAchievementCategoryImageUrl(selectedCategory, null,true) })` }} />
                    </div>
                    <AchievementCategoryView category={ selectedCategory } />
                </> }
                { !selectedCategory &&
                    <div className="pt-1.5">
                        <AchievementsCategoryListView categories={ achievementCategories } selectedCategoryCode={ selectedCategoryCode } setSelectedCategoryCode={ setSelectedCategoryCode } />
                        <div className="w-full px-[52px] pt-1.5">
                            <div className="illumina-card-item illumina-achievements-progress-bar relative flex h-[23px] items-center justify-center p-1">
                                <div className="size-full">
                                    <div className="illumina-achievements-progress-bar-percent h-full" style={ { width: (~~((((getProgress - 0) * (100 - 0)) / (getMaxProgress - 0)) + 0) + "%") } } />
                                </div>
                                <p className="absolute text-center text-xs font-semibold">{ LocalizeText("achievements.categories.totalprogress", [ "progress", "limit" ], [ getProgress.toString(), getMaxProgress.toString() ]) }</p>
                            </div>
                            <p className="pt-1 text-center text-xs font-semibold text-[#717171] [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("achievements.categories.score", [ "score" ], [ achievementScore.toString() ]) }</p>
                        </div>
                    </div> }
            </NitroCardContentView>
        </NitroCardView>
    )
}
