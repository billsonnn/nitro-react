import { RoomDataParser } from "@nitrots/nitro-renderer"
import { FC, useEffect, useState } from "react"
import { IRoomData, LocalizeText } from "../../../../api"

interface NavigatorRoomSettingsTabViewProps
{
    roomData: IRoomData;
    handleChange: (field: string, value: string | number | boolean) => void;
}

export const NavigatorRoomSettingsAccessTabView: FC<NavigatorRoomSettingsTabViewProps> = props =>
{
    const { roomData = null, handleChange = null } = props
    const [ password, setPassword ] = useState<string>("")
    const [ confirmPassword, setConfirmPassword ] = useState("")
    const [ isTryingPassword, setIsTryingPassword ] = useState(false)

    const saveRoomPassword = () =>
    {
        if(!isTryingPassword || ((password.length <= 0) || (confirmPassword.length <= 0) || (password !== confirmPassword))) return

        handleChange("password", password)
    }

    useEffect(() =>
    {
        setPassword("")
        setConfirmPassword("")
        setIsTryingPassword(false)
    }, [ roomData ])

    return (
        <div className="mt-2 flex flex-col gap-2">
            <div className="mb-3">
                <p className="mb-1 text-sm font-semibold !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("navigator.roomsettings.roomaccess.caption") }</p>
                <p className="text-sm">{ LocalizeText("navigator.roomsettings.roomaccess.info") }</p>
            </div>
            <div>
                <p className="mb-1 text-sm font-semibold !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("navigator.roomsettings.doormode") }</p>
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1">
                        <input type="radio" id="statusOpen" name="lockState" className="illumina-input" checked={ (roomData.lockState === RoomDataParser.OPEN_STATE) && !isTryingPassword } onChange={ event => handleChange("lock_state", RoomDataParser.OPEN_STATE) } />
                        <label htmlFor="statusOpen" className="text-sm">{ LocalizeText("navigator.roomsettings.doormode.open") }</label>
                    </div>
                    <div className="flex items-center gap-1">
                        <input type="radio" id="statusDoorbell" name="lockState" className="illumina-input" checked={ (roomData.lockState === RoomDataParser.DOORBELL_STATE) && !isTryingPassword } onChange={ event => handleChange("lock_state", RoomDataParser.DOORBELL_STATE) } />
                        <label htmlFor="statusDoorbell" className="text-sm">{ LocalizeText("navigator.roomsettings.doormode.doorbell") }</label>
                    </div>
                    <div className="flex items-center gap-1">
                        <input type="radio" id="statusInvisible" name="lockState" className="illumina-input" checked={ (roomData.lockState === RoomDataParser.INVISIBLE_STATE) && !isTryingPassword } onChange={ event => handleChange("lock_state", RoomDataParser.INVISIBLE_STATE) } />
                        <label htmlFor="statusInvisible" className="text-sm">{ LocalizeText("navigator.roomsettings.doormode.invisible") }</label>
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1">
                            <input type="radio" id="statusPassword" name="lockState" className="illumina-input mt-0.5" checked={ (roomData.lockState === RoomDataParser.PASSWORD_STATE) || isTryingPassword } onChange={ event => setIsTryingPassword(event.target.checked) } />
                            <label htmlFor="statusPassword" className="text-sm">{ LocalizeText("navigator.roomsettings.doormode.password") }</label>
                        </div>
                        { (isTryingPassword || (roomData.lockState === RoomDataParser.PASSWORD_STATE)) &&
                            <div className="ml-[37px] flex flex-col gap-2">
                                <div className="flex w-[195px] flex-col">
                                    <label htmlFor="password" className="text-sm">{ LocalizeText("navigator.roomsettings.password") }</label>
                                    <input type="password" id="password" className="illumina-input h-6 px-1" value={ password } autoComplete="false" onChange={ event => setPassword(event.target.value) } onFocus={ event => setIsTryingPassword(true) } />
                                    { isTryingPassword && (password.length <= 0) &&
                                        <p className="mt-0.5 text-xs">
                                            { LocalizeText("navigator.roomsettings.passwordismandatory") }
                                        </p> }
                                </div>
                                <div className="flex w-[195px] flex-col">
                                    <label htmlFor="passwordconfirm" className="text-sm">{ LocalizeText("navigator.roomsettings.passwordconfirm") }</label>
                                    <input type="password" id="passwordconfirm" className="illumina-input h-6 px-1" value={ confirmPassword } autoComplete="false" onChange={ event => setConfirmPassword(event.target.value) } onBlur={ saveRoomPassword } />
                                    { isTryingPassword && ((password.length > 0) && (password !== confirmPassword)) &&
                                        <p className="mt-0.5 text-xs">
                                            { LocalizeText("navigator.roomsettings.invalidconfirm") }
                                        </p> }
                                </div>
                            </div> }
                    </div>
                </div>
                <div className="flex flex-col gap-0.5">
                    <p className="mb-1 mt-[18px] text-sm font-semibold !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("navigator.roomsettings.pets") }</p>
                    <div className="flex items-center gap-1.5">
                        <input id="allowPets" className="illumina-input" type="checkbox" checked={ roomData.allowPets } onChange={ event => handleChange("allow_pets", event.target.checked) } />
                        <label htmlFor="allowPets" className="cursor-pointer text-sm">{ LocalizeText("navigator.roomsettings.allowpets") }</label>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <input id="allowPetsEat" className="illumina-input" type="checkbox" checked={ roomData.allowPetsEat } onChange={ event => handleChange("allow_pets_eat", event.target.checked) } />
                        <label htmlFor="allowPetsEat" className="cursor-pointer text-sm">{ LocalizeText("navigator.roomsettings.allowfoodconsume") }</label>
                    </div>
                </div>
            </div>
        </div>
    )
}
