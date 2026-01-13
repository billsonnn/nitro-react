import { RoomDeleteComposer, RoomSettingsSaveErrorEvent, RoomSettingsSaveErrorParser } from "@nitrots/nitro-renderer"
import { FC, useEffect, useState } from "react"
import { CreateLinkEvent, GetMaxVisitorsList, IRoomData, LocalizeText, SendMessageComposer } from "../../../../api"
import { useMessageEvent, useNavigator, useNotification } from "../../../../hooks"

const ROOM_NAME_MIN_LENGTH = 3
const ROOM_NAME_MAX_LENGTH = 60
const DESC_MAX_LENGTH = 255
const TAGS_MAX_LENGTH = 15

interface NavigatorRoomSettingsTabViewProps
{
    roomData: IRoomData;
    handleChange: (field: string, value: string | number | boolean | string[]) => void;
    onClose: () => void;
}

export const NavigatorRoomSettingsBasicTabView: FC<NavigatorRoomSettingsTabViewProps> = props =>
{
    const { roomData = null, handleChange = null, onClose = null } = props
    const [ roomName, setRoomName ] = useState<string>("")
    const [ roomDescription, setRoomDescription ] = useState<string>("")
    const [ roomTag1, setRoomTag1 ] = useState<string>("")
    const [ roomTag2, setRoomTag2 ] = useState<string>("")
    const [ tagIndex, setTagIndex ] = useState(0)
    const [ typeError, setTypeError ] = useState<string>("")
    const { showConfirm = null } = useNotification()
    const { categories = null } = useNavigator()

    useMessageEvent<RoomSettingsSaveErrorEvent>(RoomSettingsSaveErrorEvent, event =>
    {
        const parser = event.getParser()

        if (!parser) return

        switch (parser.code)
        {
        case RoomSettingsSaveErrorParser.ERROR_INVALID_TAG:
            setTypeError("navigator.roomsettings.unacceptablewords")
        case RoomSettingsSaveErrorParser.ERROR_NON_USER_CHOOSABLE_TAG:
            setTypeError("navigator.roomsettings.nonuserchoosabletag")
            break
        default:
            setTypeError("")
            break
        }
    })

    const deleteRoom = () =>
    {
        showConfirm(LocalizeText("navigator.roomsettings.deleteroom.confirm.message", [ "room_name" ], [ roomData.roomName ]), () =>
        {
            SendMessageComposer(new RoomDeleteComposer(roomData.roomId))

            if(onClose) onClose()

            CreateLinkEvent("navigator/search/myworld_view")
        },
        null, null, null, LocalizeText("navigator.roomsettings.deleteroom.confirm.title"))
    }

    const saveRoomName = () =>
    {
        if((roomName === roomData.roomName) || (roomName.length < ROOM_NAME_MIN_LENGTH) || (roomName.length > ROOM_NAME_MAX_LENGTH)) return

        handleChange("name", roomName)
    }

    const saveRoomDescription = () =>
    {
        if((roomDescription === roomData.roomDescription) || (roomDescription.length > DESC_MAX_LENGTH)) return

        handleChange("description", roomDescription)
    }

    const saveTags = (index: number) =>
    {
        if(index === 0 && (roomTag1 === roomData.tags[0]) || (roomTag1.length > TAGS_MAX_LENGTH)) return

        if(index === 1 && (roomTag2 === roomData.tags[1]) || (roomTag2.length > TAGS_MAX_LENGTH)) return

        if(roomTag1 === "" && roomTag2 !== "") setRoomTag2("")

        setTypeError("")
        setTagIndex(index)
        handleChange("tags", (roomTag1 === "" && roomTag2 !== "") ? [ roomTag2 ] : [ roomTag1, roomTag2 ])
    }

    useEffect(() =>
    {
        setRoomName(roomData.roomName)
        setRoomDescription(roomData.roomDescription)
        setRoomTag1((roomData.tags.length > 0 && roomData.tags[0]) ? roomData.tags[0] : "")
        setRoomTag2((roomData.tags.length > 0 && roomData.tags[1]) ? roomData.tags[1] : "")
    }, [ roomData ])

    return (
        <div className="mt-2 flex flex-col gap-2">
            <div className="flex flex-col gap-1.5">
                <p className="text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("navigator.roomname") }</p>
                <div className="flex flex-col">
                    <input spellCheck={ false } value={ roomName } className="illumina-input h-6 px-1" maxLength={ ROOM_NAME_MAX_LENGTH } onChange={ event => setRoomName(event.target.value) } onBlur={ saveRoomName } />
                    { (roomName.length < ROOM_NAME_MIN_LENGTH) &&
                        <p className="mb-2 mt-0.5 text-xs">
                            { LocalizeText("navigator.roomsettings.roomnameismandatory") }
                        </p> }
                </div>
            </div>
            <div className="flex flex-col gap-1.5">
                <p className="text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("navigator.roomsettings.desc") }</p>
                <div className="illumina-input h-[41px] w-full p-1">
                    <textarea spellCheck={ false } className="illumina-scrollbar w-full text-sm" value={ roomDescription } maxLength={ DESC_MAX_LENGTH } onChange={ event => setRoomDescription(event.target.value) } onBlur={ saveRoomDescription } />
                </div>
            </div>
            <div className="flex flex-col gap-1.5">
                <p className="text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("navigator.category") }</p>
                <div className="illumina-select relative flex h-6 items-center gap-[3px] px-2.5">
                    <select className="w-full bg-transparent text-sm" value={ roomData.categoryId } onChange={ event => handleChange("category", event.target.value) }>
                        { categories && categories.map(category => <option className="!text-black" key={ category.id } value={ category.id }>{ LocalizeText(category.name) }</option>) }
                    </select>
                    <i className="pointer-events-none h-2 w-3 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-269px_-23px]" />
                </div>
            </div>
            <div className="flex flex-col gap-1.5">
                <p className="text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("navigator.maxvisitors") }</p>
                <div className="illumina-select relative flex h-6 items-center gap-[3px] px-2.5">
                    <select className="w-full bg-transparent text-sm" value={ roomData.userCount } onChange={ event => handleChange("max_visitors", event.target.value) }>
                        { GetMaxVisitorsList && GetMaxVisitorsList.map(value => <option className="!text-black" key={ value } value={ value }>{ value }</option>) }
                    </select>
                    <i className="pointer-events-none h-2 w-3 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-269px_-23px]" />
                </div>
            </div>
            <div className="flex flex-col gap-1.5">
                <p className="text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("navigator.tradesettings") }</p>
                <div className="illumina-select relative flex h-6 items-center gap-[3px] px-2.5">
                    <select className="w-full bg-transparent text-sm" value={ roomData.tradeState } onChange={ event => handleChange("trade_state", event.target.value) }>
                        <option className="!text-black" value="0">{ LocalizeText("navigator.roomsettings.trade_not_allowed") }</option>
                        <option className="!text-black" value="1">{ LocalizeText("navigator.roomsettings.trade_not_with_Controller") }</option>
                        <option className="!text-black" value="2">{ LocalizeText("navigator.roomsettings.trade_allowed") }</option>
                    </select>
                    <i className="pointer-events-none h-2 w-3 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-269px_-23px]" />
                </div>
            </div>
            <div className="flex flex-col gap-1.5">
                <p className="text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("navigator.tags") }</p>
                <div className="flex gap-1">
                    <input value={ roomTag1 } className="illumina-input h-6 w-full px-1" maxLength={ TAGS_MAX_LENGTH } onChange={ event => setRoomTag1(event.target.value) } onBlur={ () => saveTags(0) } />
                    <input value={ roomTag2 } className="illumina-input h-6 w-full px-1" maxLength={ TAGS_MAX_LENGTH } onChange={ event => setRoomTag2(event.target.value) } onBlur={ () => saveTags(1) } />
                </div>
            </div>
            <div className="mb-2 mt-1.5">
                <div className="flex items-center gap-1.5">
                    <input id="allowWalkthrough" className="illumina-input" type="checkbox" checked={ roomData.allowWalkthrough } onChange={ event => handleChange("allow_walkthrough", event.target.checked) } />
                    <label htmlFor="allowWalkthrough" className="cursor-pointer text-sm">{ LocalizeText("navigator.roomsettings.allow_walk_through") }</label>
                </div>
            </div>
            <div className="flex cursor-pointer items-center justify-center gap-1" onClick={ deleteRoom }>
                <i className="size-[13px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-226px_-100px]" />
                <p className="text-sm font-semibold !leading-3 text-[#D14248] underline [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("navigator.roomsettings.delete") }</p>
            </div>
        </div>
    )
}
