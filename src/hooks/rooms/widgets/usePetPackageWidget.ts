import { OpenPetPackageMessageComposer, RoomObjectCategory, RoomSessionPetPackageEvent } from "@nitrots/nitro-renderer"
import { useState } from "react"
import { GetRoomEngine, LocalizeText, NotificationAlertType, SendMessageComposer } from "../../../api"
import { useRoomSessionManagerEvent } from "../../events"
import { useNotification } from "../../notification"

const usePetPackageWidgetState = () =>
{
    const { simpleAlert = null } = useNotification()
    const [ isVisible, setIsVisible ] = useState<boolean>(false)
    const [ objectId, setObjectId ] = useState<number>(-1)
    const [ objectType, setObjectType ] = useState<string>("")
    const [ petName, setPetName ] = useState<string>("")
    const [ errorResult, setErrorResult ] = useState<string>("")
    
    const onClose = () =>
    {
        setErrorResult("")
        setPetName("")
        setObjectType("")
        setObjectId(-1)
        setIsVisible(false)
    }

    const onConfirm = () =>
    {
        if(petName.length > 3) {
            SendMessageComposer(new OpenPetPackageMessageComposer(objectId, petName))
        } else {
            getErrorResultForCode(2)
        }
    }

    const onChangePetName = (petName: string) =>
    {
        setPetName(petName)
        if (errorResult.length > 0) setErrorResult("")
    }

    const getErrorResultForCode = (errorCode: number) =>
    {
        if (!errorCode || errorCode === 0) return
        
        simpleAlert(LocalizeText("catalog.alert.petname.short"), NotificationAlertType.ALERT, null, null, LocalizeText("catalog.alert.purchaseerror.title"))
        return
    }

    useRoomSessionManagerEvent<RoomSessionPetPackageEvent>(RoomSessionPetPackageEvent.RSOPPE_OPEN_PET_PACKAGE_REQUESTED, event =>
    {
        if (!event) return

        const roomObject = GetRoomEngine().getRoomObject(event.session.roomId, event.objectId, RoomObjectCategory.FLOOR)
        
        setObjectId(event.objectId)
        setObjectType(roomObject.type)
        setIsVisible(true)
    })

    useRoomSessionManagerEvent<RoomSessionPetPackageEvent>(RoomSessionPetPackageEvent.RSOPPE_OPEN_PET_PACKAGE_RESULT, event =>
    {
        if (!event) return

        if (event.nameValidationStatus === 0) onClose()
        
        //if (event.nameValidationStatus !== 0) setErrorResult(getErrorResultForCode(event.nameValidationStatus));
    })

    return { isVisible, errorResult, petName, objectType, onChangePetName, onConfirm, onClose }
}

export const usePetPackageWidget = usePetPackageWidgetState
