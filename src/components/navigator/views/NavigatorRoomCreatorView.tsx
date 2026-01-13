/* eslint-disable no-template-curly-in-string */
import { CreateFlatMessageComposer, HabboClubLevelEnum } from "@nitrots/nitro-renderer"
import { FC, MouseEvent, useEffect, useState } from "react"
import { CreateLinkEvent, GetClubMemberLevel, GetConfiguration, IRoomModel, LocalizeText, SendMessageComposer } from "../../../api"
import { Button, ColumnProps, LayoutGridItem, NitroCardContentView, NitroCardHeaderView, NitroCardView } from "../../../common"
import { useNavigator } from "../../../hooks"

interface NavigatorRoomCreatorViewProps extends ColumnProps {
    onCloseClick: (event: MouseEvent) => void;
}

export const NavigatorRoomCreatorView: FC<NavigatorRoomCreatorViewProps> = props => {
    const { onCloseClick = null } = props
    const [ maxVisitorsList, setMaxVisitorsList ] = useState<number[]>(null)
    const [ name, setName ] = useState<string>(null)
    const [ description, setDescription ] = useState<string>(null)
    const [ category, setCategory ] = useState<number>(null)
    const [ visitorsCount, setVisitorsCount ] = useState<number>(null)
    const [ tradesSetting, setTradesSetting ] = useState<number>(0)
    const [ roomModels, setRoomModels ] = useState<IRoomModel[]>([])
    const [ selectedModelName, setSelectedModelName ] = useState<string>("")
    const { categories = null } = useNavigator()

    const uiKey: string = GetConfiguration<string>("illumina.key")
    const hcDisabled = GetConfiguration<boolean>("hc.disabled", false)

    const getRoomModelImage = (name: string) => GetConfiguration<string>("images.url") + `/navigator/models/model_${name}.png?v=2451779`

    const selectModel = (model: IRoomModel, index: number) => {
        if (!model || (model.clubLevel > GetClubMemberLevel())) return

        setSelectedModelName(roomModels[index].name)
    }

    const createRoom = () => {
        SendMessageComposer(new CreateFlatMessageComposer(name, description, "model_" + selectedModelName, Number(category), Number(visitorsCount), tradesSetting))
    }

    useEffect(() => {
        if (!maxVisitorsList) {
            const list = []

            for (let i = 10; i <= 100; i = i + 10) list.push(i)

            setMaxVisitorsList(list)
            setVisitorsCount(list[0])
        }
    }, [ maxVisitorsList ])

    useEffect(() => {
        if (categories && categories.length) setCategory(categories[0].id)
    }, [ categories ])

    useEffect(() => {
        const models = GetConfiguration<IRoomModel[]>("navigator.room.models")

        if (models && models.length) {
            setRoomModels(models)
            setSelectedModelName(models[0].name)
        }
    }, [])

    return (
        <NitroCardView uniqueKey="create-room" className="illumina-create-room h-[367px]">
            <NitroCardHeaderView headerText={LocalizeText("navigator.createroom.title")} onCloseClick={onCloseClick} />
            <NitroCardContentView position="relative" className="min-h-[334px]">
                <div className="w-full">
                    <div className="flex h-full gap-5">
                        <div className="w-60">
                            <div className="mb-2.5 flex flex-col gap-[5px]">
                                <p className="font-volter_bold text-[9px]">{LocalizeText("navigator.createroom.roomnameinfo")}</p>
                                <div className="illumina-input relative h-5">
                                    <input type="text" className="absolute left-0 top-0 size-full bg-transparent px-[9px] font-volter text-[9px] placeholder:text-black" maxLength={60} placeholder={LocalizeText("navigator.createroom.roomnameinfo")} onChange={event => setName(event.target.value)} />
                                </div>
                            </div>
                            <div className="mb-2.5 flex flex-col gap-[5px]">
                                <p className="font-volter_bold text-[9px]">{LocalizeText("navigator.createroom.roomdescinfo")}</p>
                                <div className="illumina-input relative h-[60px]">
                                    <textarea className="illumina-scrollbar size-full bg-transparent px-1.5 py-[3px] font-volter text-[9px] placeholder:text-black" spellCheck={false} maxLength={255} placeholder={LocalizeText("navigator.createroom.roomdescinfo")} onChange={event => setDescription(event.target.value)} />
                                </div>
                            </div>
                            <div className="mb-2.5 flex flex-col gap-[5px]">
                                <p className="font-volter_bold text-[9px]">{LocalizeText("navigator.category")}</p>
                                <div className='illumina-select relative flex h-6 items-center gap-[3px] px-2.5'>
                                    <select className="w-full bg-transparent font-volter text-[9px]" onChange={event => setCategory(Number(event.target.value))}>
                                        {categories && (categories.length > 0) && categories.map(category => {
                                            return <option className="!text-black" key={category.id} value={category.id}>{LocalizeText(category.name)}</option>
                                        })}
                                    </select>
                                    <i className="pointer-events-none h-2 w-3 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-269px_-23px]" />
                                </div>
                            </div>
                            <div className="mb-2.5 flex flex-col gap-[5px]">
                                <p className="font-volter_bold text-[9px]">{LocalizeText("navigator.maxvisitors")}</p>
                                <div className='illumina-select relative flex h-6 items-center gap-[3px] px-2.5'>
                                    <select className="w-full bg-transparent font-volter text-[9px] text-black" onChange={event => setVisitorsCount(Number(event.target.value))}>
                                        {maxVisitorsList && maxVisitorsList.map(value => {
                                            return <option className="!text-black" key={value} value={value}>{value}</option>
                                        })}
                                    </select>
                                    <i className="pointer-events-none h-2 w-3 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-269px_-23px]" />
                                </div>
                            </div>
                            <div className="mb-2.5 flex flex-col gap-[5px]">
                                <p className="font-volter_bold text-[9px]">{LocalizeText("navigator.tradesettings")}</p>
                                <div className='illumina-select relative flex h-6 items-center gap-[3px] px-2.5'>
                                    <select className="w-full bg-transparent font-volter text-[9px] text-black" onChange={event => setTradesSetting(Number(event.target.value))}>
                                        <option className="!text-black" value="0">{LocalizeText("navigator.roomsettings.trade_not_allowed")}</option>
                                        <option className="!text-black" value="1">{LocalizeText("navigator.roomsettings.trade_not_with_Controller")}</option>
                                        <option className="!text-black" value="2">{LocalizeText("navigator.roomsettings.trade_allowed")}</option>
                                    </select>
                                    <i className="pointer-events-none h-2 w-3 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-269px_-23px]" />
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <Button variant="volter-bold" className="w-[100px] !px-0" onClick={createRoom}>{LocalizeText("navigator.createroom.create")}</Button>
                                <Button variant="volter" className="w-[100px] !px-0" onClick={onCloseClick}>{LocalizeText("cancel")}</Button>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2.5">
                            <p className="font-volter_bold text-[9px] text-black">{LocalizeText("navigator.createroom.chooselayoutcaption")}</p>
                            <div className="illumina-scrollbar grid max-h-[295px] !grid-cols-[repeat(2,minmax(135px,0fr))] !grid-rows-[repeat(auto-fit,minmax(96px,0fr))] !gap-[3px] pt-px">
                                {roomModels.map((model, index) => (
                                    <LayoutGridItem
                                        key={model.name}
                                        className="!h-24 !w-full"
                                        onClick={() => GetClubMemberLevel() < model.clubLevel ? CreateLinkEvent("habboUI/open/hccenter") : selectModel(model, index)}
                                        itemActive={(selectedModelName === model.name)}
                                        itemAbsolute={true}
                                        overflow="hidden"
                                        disabled={(GetClubMemberLevel() < model.clubLevel)}
                                    >
                                        <img className="translate-y-[-5px]" alt="" src={getRoomModelImage(model.name)} />
                                        <div className="absolute bottom-[5px] left-[5px] flex items-center gap-[5px] bg-[#d9d9d9] p-[3px] dark:bg-[#211d19]">
                                            <i className="h-2.5 w-[18px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-302px_0px]" />
                                            <p className="font-volter text-[9px]">{model.tileSize} {LocalizeText("navigator.createroom.tilesize")}</p>
                                        </div>
                                        {!hcDisabled && model.clubLevel > HabboClubLevelEnum.NO_CLUB && <i className="absolute right-1 top-1 h-[9px] w-2.5 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-298px_-69px]" />}
                                    </LayoutGridItem>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    )
}
