import { GroupSaveInformationComposer } from "@nitrots/nitro-renderer"
import { Dispatch, FC, SetStateAction, useCallback, useEffect, useState } from "react"
import { CreateLinkEvent, IGroupData, LocalizeText, NotificationAlertType, SendMessageComposer } from "../../../../api"
import { useNotification } from "../../../../hooks"

interface GroupTabIdentityViewProps
{
    groupData: IGroupData;
    setGroupData: Dispatch<SetStateAction<IGroupData>>;
    setCloseAction: Dispatch<SetStateAction<{ action: () => boolean }>>;
    onClose: () => void;
    isCreator?: boolean;
    availableRooms?: { id: number, name: string }[];
}

export const GroupTabIdentityView: FC<GroupTabIdentityViewProps> = props =>
{
    const { groupData = null, setGroupData = null, setCloseAction = null, onClose = null, isCreator = false, availableRooms = [] } = props
    const [ groupName, setGroupName ] = useState<string>("")
    const [ groupDescription, setGroupDescription ] = useState<string>("")
    const [ groupHomeroomId, setGroupHomeroomId ] = useState<number>(-1)
    const { simpleAlert = null } = useNotification()

    const saveIdentity = useCallback(() =>
    {
        if(!groupData || !groupName || !groupName.length || groupHomeroomId <= 0) {
            simpleAlert(LocalizeText("group.edit.error.no.name.or.room.selected"), NotificationAlertType.ALERT, null, null, LocalizeText("group.edit.error.title"))
            return
        }

        if((groupName === groupData.groupName) && (groupDescription === groupData.groupDescription)) return true

        if(groupData.groupId <= 0)
        {
            if(groupHomeroomId <= 0) return false

            setGroupData(prevValue =>
            {
                const newValue = { ...prevValue }

                newValue.groupName = groupName
                newValue.groupDescription = groupDescription
                newValue.groupHomeroomId = groupHomeroomId

                return newValue
            })

            return true
        }

        SendMessageComposer(new GroupSaveInformationComposer(groupData.groupId, groupName, (groupDescription || "")))

        return true
    }, [ groupData, groupName, groupDescription, groupHomeroomId, setGroupData ])

    useEffect(() =>
    {
        setGroupName(groupData.groupName || "")
        setGroupDescription(groupData.groupDescription || "")
        setGroupHomeroomId(groupData.groupHomeroomId)
    }, [ groupData ])

    useEffect(() =>
    {
        setCloseAction({ action: saveIdentity })

        return () => setCloseAction(null)
    }, [ setCloseAction, saveIdentity ])

    if(!groupData) return null

    return (
        <div className="flex justify-between gap-[15px]">
            <div />
            <div className="flex w-[248px] flex-col">
                <div className="flex flex-col gap-[15px]">
                    <div className="flex flex-col gap-2">
                        <p className="pl-[3px] text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("group.edit.name") }</p>
                        <input type="text" className="illumina-input h-[27px] px-[9px] text-xs" value={ groupName } maxLength={ 29 } onChange={ event => setGroupName(event.target.value) } />
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="pl-[3px] text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("group.edit.desc") }</p>
                        <textarea className="illumina-input h-[85px] p-[9px] text-xs" spellCheck={ false } value={ groupDescription } maxLength={ 254 } onChange={ event => setGroupDescription(event.target.value) } />
                    </div>
                    { isCreator && <>
                        <div>
                            <div className="flex flex-col gap-2">
                                <p className="pl-[3px] text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("group.edit.base") }</p>
                                <div className='illumina-select relative flex h-[27px] items-center gap-[3px] px-[9px]'>
                                    <select className="w-full bg-transparent text-xs" value={ groupHomeroomId } onChange={ event => setGroupHomeroomId(parseInt(event.target.value)) }>
                                        <option className="!text-black" value={ -1 } disabled>{ LocalizeText("group.edit.base.select.room") }</option>
                                        { availableRooms && availableRooms.map((room, index) => <option className="!text-black" key={ index } value={ room.id }>{ room.name }</option>) }
                                    </select>
                                    <i className="pointer-events-none h-2 w-3 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-269px_-23px]" />
                                </div>
                            </div>
                            <p className="mt-[3px] text-sm italic">{ LocalizeText("group.edit.base.warning") }</p>
                            <p className="mb-3 mt-3.5 cursor-pointer text-sm underline" onClick={ event => CreateLinkEvent("navigator/create") }>{ LocalizeText("group.createroom") }</p>
                        </div>
                    </>}
                </div>
            </div>
        </div>
    )
}
