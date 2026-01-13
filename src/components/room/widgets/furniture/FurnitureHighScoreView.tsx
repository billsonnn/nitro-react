import { RoomObjectCategory } from "@nitrots/nitro-renderer"
import { FC } from "react"
import { LocalizeText } from "../../../../api"
import { useFurnitureHighScoreWidget } from "../../../../hooks"
import { ObjectLocationView } from "../object-location/ObjectLocationView"

export const FurnitureHighScoreView: FC<{}> = props =>
{
    const { stuffDatas = null, getScoreType = null, getClearType = null } = useFurnitureHighScoreWidget()

    if(!stuffDatas || !stuffDatas.size) return null

    return (
        <>
            { Array.from(stuffDatas.entries()).map(([ objectId, stuffData ], index) => (
                <ObjectLocationView key={ index } objectId={ objectId } category={ RoomObjectCategory.FLOOR }>
                    <div className="relative h-[335px] w-[263px] bg-[url('/client-assets/images/highscore/spritesheet.png?v=2451779')] p-1">
                        <div className="flex h-5 w-64 items-center justify-center">
                            <p className="text-xs font-semibold text-white">
                                { LocalizeText("high.score.display.caption", [ "scoretype", "cleartype" ], [ LocalizeText(`high.score.display.scoretype.${ getScoreType(stuffData.scoreType) }`), LocalizeText(`high.score.display.cleartype.${ getClearType(stuffData.clearType) }`) ]) }
                            </p>
                        </div>
                        <div className="">
                            <div className="flex">
                                <div className="flex h-[23px] w-[190px] items-center px-1.5">
                                    <p className="text-xs !text-[#010101] [text-shadow:_0_1px_0_#EAE9E8]">
                                        { LocalizeText("high.score.display.users.header") }
                                    </p>
                                </div>
                                <div className="flex h-[23px] w-[67px] items-center px-1.5">
                                    <p className="w-full text-right text-xs !text-[#010101] [text-shadow:_0_1px_0_#EAE9E8]">
                                        { LocalizeText("high.score.display.score.header") }
                                    </p>
                                </div>
                            </div>
                            <div className="illumina-scrollbar flex h-[255px] w-[257px] flex-col gap-1.5 p-1.5">
                                { stuffData.entries.map((entry, index) => 
                                    <div key={ index } className="flex items-center justify-between">
                                        <p className="text-xs !leading-3 text-white">
                                            { entry.users.join(", ") }
                                        </p>
                                        <p className="text-xs !leading-3 text-white">
                                            { entry.score }
                                        </p>
                                    </div>
                                )}
                            </div>
                            <p className="w-full pt-[5px] text-center text-xs !text-[#727272] [text-shadow:_0_1px_0_#BAB8B4]">
                                { LocalizeText("high.score.display.congratulations.footer") }
                            </p>
                        </div>
                        <i className="absolute -left-1.5 bottom-1.5 h-6 w-[29px] bg-[url('/client-assets/images/highscore/spritesheet.png?v=2451779')] bg-[-264px_0px]" />
                    </div>
                </ObjectLocationView>
            ))}
        </>
    )
}
