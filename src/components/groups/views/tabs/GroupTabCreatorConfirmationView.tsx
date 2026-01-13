import { Dispatch, FC, SetStateAction } from "react"
import { CreateLinkEvent, HasHabboClub, IGroupData, LocalizeText } from "../../../../api"
import { LayoutBadgeImageView } from "../../../../common"
import { useGroup } from "../../../../hooks"

interface GroupTabCreatorConfirmationViewProps
{
    groupData: IGroupData;
    setGroupData: Dispatch<SetStateAction<IGroupData>>;
    purchaseCost: number;
}

export const GroupTabCreatorConfirmationView: FC<GroupTabCreatorConfirmationViewProps> = props =>
{
    const { groupData = null, setGroupData = null, purchaseCost = 0 } = props
    const { groupCustomize = null } = useGroup()

    const getCompleteBadgeCode = () =>
    {
        if(!groupData || !groupData.groupBadgeParts || !groupData.groupBadgeParts.length) return ""

        let badgeCode = ""

        groupData.groupBadgeParts.forEach(part => (part.code && (badgeCode += part.code)))

        return badgeCode
    }
    
    const getGroupColor = (colorIndex: number) =>
    {
        if(colorIndex === 0) return groupCustomize.groupColorsA.find(c => c.id === groupData.groupColors[colorIndex]).color

        return groupCustomize.groupColorsB.find(c => c.id === groupData.groupColors[colorIndex]).color
    }

    if(!groupData) return null

    return (
        <div className="flex h-full gap-[22px]">
            <div className="mt-[23px]">
                <div>
                    <p className="mb-[5px] text-center text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("group.create.confirm.guildbadge") }</p>
                    <div className="illumina-previewer relative flex size-[94px] shrink-0 items-center justify-center overflow-hidden p-[3px]">
                        <LayoutBadgeImageView badgeCode={ getCompleteBadgeCode() } isGroup={ true } />
                    </div>
                </div>
                <div className="mt-[15px]">
                    <p className="mb-[5px] text-center text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("group.edit.color.guild.color") }</p>
                    <div className="illumina-previewer flex gap-1 p-2">
                        <i className="h-[30px] w-9 bg-[url('/client-assets/images/groups/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/groups/spritesheet-dark.png?v=2451779')] bg-[-501px_-124px]" style={ { backgroundColor: "#" + getGroupColor(0) } } />
                        <i className="h-[30px] w-9 bg-[url('/client-assets/images/groups/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/groups/spritesheet-dark.png?v=2451779')] bg-[-501px_-124px]" style={ { backgroundColor: "#" + getGroupColor(1) } } />
                    </div>
                </div>
            </div>
            <div className="flex h-full flex-col items-end">
                <div className="flex-1">
                    <p className="mb-[23px] text-xl font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ groupData.groupName }</p>
                    <p className="text-sm">{ LocalizeText("group.create.confirm.info") }</p>
                </div>
                {!HasHabboClub() &&
                    <div className="illumina-groups-hc-required mb-[7px] flex w-[248px] cursor-pointer items-center gap-3 px-3.5 py-2" onClick={ event => CreateLinkEvent("habboUI/open/hccenter") }>
                        <i className="size-[15px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-257px_-84px]" />
                        <div className="flex flex-col">
                            <p className="mb-[3px] text-sm font-semibold !leading-3 text-white [text-shadow:_0_1px_0_#CB0000]">{ LocalizeText("group.create.confirm.viprequired") }</p>
                            <p className="text-sm !leading-3 text-white">{ LocalizeText("group.create.confirm.getvip") }</p>
                        </div>
                    </div> }
            </div>
        </div>
    )
}
