import { Dispatch, FC, SetStateAction, useState } from "react"
import { GroupBadgePart, LocalizeText } from "../../../api"
import { Button, LayoutBadgeImageView } from "../../../common"
import { useGroup } from "../../../hooks"

interface GroupBadgeCreatorViewProps {
    badgeParts: GroupBadgePart[];
    setBadgeParts: Dispatch<SetStateAction<GroupBadgePart[]>>;
}

const POSITIONS: number[] = [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ]

export const GroupBadgeCreatorView: FC<GroupBadgeCreatorViewProps> = props => {
    const { badgeParts = [], setBadgeParts = null } = props
    const [ selectedIndex, setSelectedIndex ] = useState<number>(-1)
    const { groupCustomize = null } = useGroup()

    const setPartProperty = (partIndex: number, property: string, value: number) => {
        const newBadgeParts = [ ...badgeParts ]
        newBadgeParts[partIndex][property] = value
        setBadgeParts(newBadgeParts)
        if (property === "key") setSelectedIndex(-1)
    }

    if (!badgeParts || !badgeParts.length) return null

    return (
        <>
            {selectedIndex < 0 &&
                <>
                    <div>
                        <div className="flex w-full justify-between">
                            <p className="mb-[5px] w-[49px] text-center text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("group.edit.badge.symbol") }</p>
                            <p className="mb-[5px] w-[45px] text-center text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("group.edit.badge.position") }</p>
                            <p className="mb-[5px] w-[120px] text-center text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("group.edit.badge.colors") }</p>
                        </div>
                        {badgeParts.map((part, index) => { 
                            if(index !== 0) return (
                                <div key={index} className="mb-0.5 flex justify-between">
                                    <div onClick={event => setSelectedIndex(index)}>
                                        {(badgeParts[index].code && badgeParts[index].code.length > 0) ? (
                                            <Button className="!size-[49px] !px-0">
                                                <LayoutBadgeImageView badgeCode={badgeParts[index].code} isGroup={true} />
                                            </Button>
                                        ) : (
                                            <Button className="!size-[49px]">
                                                <i className="size-[17px] bg-[url('/client-assets/images/groups/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/groups/spritesheet-dark.png?v=2451779')] bg-[-455px_-124px]" />
                                            </Button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-3 gap-0">
                                        {POSITIONS.map((position, posIndex) => (
                                            <i key={posIndex} className={`size-[15px] bg-[url('/client-assets/images/groups/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/groups/spritesheet-dark.png?v=2451779')] ${badgeParts[index].position === position ? "bg-[-439px_-124px]" : "bg-[-423px_-124px]"}`} onClick={event => setPartProperty(index, "position", position)} />
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-8 content-start">
                                        {groupCustomize.badgePartColors.length > 0 && groupCustomize.badgePartColors.map((item, colorIndex) => (
                                            <div key={colorIndex} className={`size-[15px] bg-[url('/client-assets/images/groups/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/groups/spritesheet-dark.png?v=2451779')] ${badgeParts[index].color === colorIndex + 1 ? "bg-[-407px_-124px]" : "bg-[-391px_-124px]"}`} style={{ backgroundColor: "#" + item.color }} onClick={event => setPartProperty(index, "color", colorIndex + 1)} />
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="mt-1.5">
                        <div className="flex w-full justify-between">
                            <p className="mb-[5px] w-[49px] text-center text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("group.edit.badge.base") }</p>
                            <p className="mb-[5px] w-[120px] text-center text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("group.edit.badge.colors") }</p>
                        </div>
                        {badgeParts.filter(part => part.type === GroupBadgePart.BASE).map((part, index) => (
                            <div key={index} className="mb-0.5 flex justify-between">
                                <div onClick={event => setSelectedIndex(index)}>
                                    {(badgeParts[index].code && badgeParts[index].code.length > 0) ? (
                                        <Button className="!size-[49px] !px-0">
                                            <LayoutBadgeImageView badgeCode={badgeParts[index].code} isGroup={true} />
                                        </Button>
                                    ) : (
                                        <Button className="!size-[49px]">
                                            <i className="size-[17px] bg-[url('/client-assets/images/groups/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/groups/spritesheet-dark.png?v=2451779')] bg-[-455px_-124px]" />
                                        </Button>
                                    )}
                                </div>
                                <div className="grid grid-cols-8 content-start">
                                    {groupCustomize.badgePartColors.length > 0 && groupCustomize.badgePartColors.map((item, colorIndex) => (
                                        <div key={colorIndex} className={`size-[15px] bg-[url('/client-assets/images/groups/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/groups/spritesheet-dark.png?v=2451779')] ${badgeParts[index].color === colorIndex + 1 ? "bg-[-407px_-124px]" : "bg-[-391px_-124px]"}`} style={{ backgroundColor: "#" + item.color }} onClick={event => setPartProperty(index, "color", colorIndex + 1)} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </> }
            {selectedIndex >= 0 && (
                <div className="illumina-scrollbar grid max-h-[300px] grid-cols-5">
                    {badgeParts[selectedIndex].type === GroupBadgePart.SYMBOL && (
                        <div className="illumina-furni-item flex size-[41px] items-center justify-center overflow-hidden" onClick={event => setPartProperty(selectedIndex, "key", 0)}>
                            <i className="size-[27px] bg-[url('/client-assets/images/groups/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/groups/spritesheet-dark.png?v=2451779')] bg-[-473px_-124px]" />
                        </div>
                    )}
                    {(badgeParts[selectedIndex].type === GroupBadgePart.BASE
                        ? groupCustomize.badgeBases
                        : groupCustomize.badgeSymbols
                    ).map((item, index) => (
                        <div key={index} className="illumina-furni-item size-[41px] overflow-hidden" onClick={event => setPartProperty(selectedIndex, "key", item.id)}>
                            <LayoutBadgeImageView badgeCode={GroupBadgePart.getCode(badgeParts[selectedIndex].type, item.id, badgeParts[selectedIndex].color, 4)} isGroup={true} />
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}
