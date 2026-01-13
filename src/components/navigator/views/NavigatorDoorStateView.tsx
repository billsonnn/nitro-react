import { FC, useEffect, useState } from "react"
import { CreateRoomSession, DoorStateType, GoToDesktop, LocalizeText } from "../../../api"
import { Button, DraggableWindowPosition, NitroCardContentView, NitroCardHeaderView, NitroCardView } from "../../../common"
import { useNavigator } from "../../../hooks"

const VISIBLE_STATES = [ DoorStateType.START_DOORBELL, DoorStateType.STATE_WAITING, DoorStateType.STATE_NO_ANSWER, DoorStateType.START_PASSWORD, DoorStateType.STATE_WRONG_PASSWORD ]
const DOORBELL_STATES = [ DoorStateType.START_DOORBELL, DoorStateType.STATE_WAITING, DoorStateType.STATE_NO_ANSWER ]
const PASSWORD_STATES = [ DoorStateType.START_PASSWORD, DoorStateType.STATE_WRONG_PASSWORD ]

export const NavigatorDoorStateView: FC<{}> = props =>
{
    const [ password, setPassword ] = useState("")
    const { doorData = null, setDoorData = null } = useNavigator()

    const onClose = () =>
    {
        if(doorData && (doorData.state === DoorStateType.STATE_WAITING)) GoToDesktop()

        setDoorData(null)
    }

    const ring = () =>
    {
        if(!doorData || !doorData.roomInfo) return

        CreateRoomSession(doorData.roomInfo.roomId)
        
        setDoorData(prevValue =>
        {
            const newValue = { ...prevValue }

            newValue.state = DoorStateType.STATE_PENDING_SERVER

            return newValue
        })
    }

    const tryEntering = () =>
    {
        if(!doorData || !doorData.roomInfo) return

        CreateRoomSession(doorData.roomInfo.roomId, password)

        setDoorData(prevValue =>
        {
            const newValue = { ...prevValue }

            newValue.state = DoorStateType.STATE_PENDING_SERVER

            return newValue
        })
    }

    useEffect(() =>
    {
        if(!doorData || (doorData.state !== DoorStateType.STATE_NO_ANSWER)) return

        GoToDesktop()
    }, [ doorData ])

    if(!doorData || (doorData.state === DoorStateType.NONE) || (VISIBLE_STATES.indexOf(doorData.state) === -1)) return null

    const isDoorbell = (DOORBELL_STATES.indexOf(doorData.state) >= 0)

    return (
        <NitroCardView uniqueKey="door-state" className="illumina-door-state w-[237px]" windowPosition={ DraggableWindowPosition.TOP_LEFT }>
            <NitroCardHeaderView headerText={ LocalizeText(isDoorbell ? "navigator.doorbell.title" : "navigator.password.title") } onCloseClick={ onClose } />
            <NitroCardContentView>
                <div className="flex min-h-[90px] flex-col">
                    <p className="mb-2.5 text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ doorData && doorData.roomInfo && doorData.roomInfo.roomName }</p>
                    { (doorData.state === DoorStateType.START_DOORBELL) &&
                        <p className="text-sm">{ LocalizeText("navigator.doorbell.info") }</p> }
                    { (doorData.state === DoorStateType.STATE_WAITING) &&
                        <p className="text-sm">{ LocalizeText("navigator.doorbell.waiting") }</p> }
                    { (doorData.state === DoorStateType.STATE_NO_ANSWER) &&
                        <p className="text-sm">{ LocalizeText("navigator.doorbell.no.answer") }</p> }
                    { (doorData.state === DoorStateType.START_PASSWORD) &&
                        <p className="text-sm">{ LocalizeText("navigator.password.info") }</p> }
                    { (doorData.state === DoorStateType.STATE_WRONG_PASSWORD) &&
                        <p className="text-sm">{ LocalizeText("navigator.password.retryinfo") }</p> }
                </div>
                { isDoorbell &&
                    <div className="flex items-center justify-between">
                        <Button variant="underline" onClick={ onClose }>
                            { (doorData.state === DoorStateType.START_DOORBELL)
                                ? LocalizeText("generic.cancel")
                                : LocalizeText("navigator.doorbell.button.cancel.entering") }
                        </Button>
                        { (doorData.state === DoorStateType.START_DOORBELL) &&
                            <Button onClick={ ring }>
                                { LocalizeText("navigator.doorbell.button.ring") }
                            </Button> }
                    </div> }
                { !isDoorbell &&
                    <>
                        <div className="mb-[18px] flex items-center justify-between gap-[15px]">
                            <p className="text-sm">{ LocalizeText("navigator.password.enter") }</p>
                            <input type="password" className="border border-[#919191] bg-transparent px-0.5 py-[3px] text-xs dark:border-[#36322C]" autoComplete="false" onChange={ event => setPassword(event.target.value) } />
                        </div>
                        <div className="flex items-center justify-between">
                            <Button variant="underline" onClick={ onClose }>
                                { LocalizeText("generic.cancel") }
                            </Button>
                            <Button onClick={ tryEntering }>
                                { LocalizeText("navigator.password.button.try") }
                            </Button>
                        </div>
                    </> }
            </NitroCardContentView>
        </NitroCardView>
    )
}
