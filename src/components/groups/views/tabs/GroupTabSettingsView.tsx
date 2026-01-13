import { GroupSavePreferencesComposer } from "@nitrots/nitro-renderer"
import { Dispatch, FC, SetStateAction, useCallback, useEffect, useState } from "react"
import { IGroupData, LocalizeText, SendMessageComposer } from "../../../../api"

const STATES: string[] = [ "regular", "exclusive", "private" ]

interface GroupTabSettingsViewProps
{
    groupData: IGroupData;
    setGroupData: Dispatch<SetStateAction<IGroupData>>;
    setCloseAction: Dispatch<SetStateAction<{ action: () => boolean }>>;
}

export const GroupTabSettingsView: FC<GroupTabSettingsViewProps> = props =>
{
    const { groupData = null, setGroupData = null, setCloseAction = null } = props
    const [ groupState, setGroupState ] = useState<number>(groupData.groupState)
    const [ groupDecorate, setGroupDecorate ] = useState<boolean>(groupData.groupCanMembersDecorate)

    const getGroupTypeIcon = {
        0: "bg-[-246px_-125px] w-3.5 h-4",
        1: "bg-[-261px_-125px] w-4 h-3",
        2: "bg-[-278px_-125px] w-[15px] h-4"
    }

    const saveSettings = useCallback(() =>
    {
        if(!groupData) return false

        if((groupState === groupData.groupState) && (groupDecorate === groupData.groupCanMembersDecorate)) return true

        if(groupData.groupId <= 0)
        {
            setGroupData(prevValue =>
            {
                const newValue = { ...prevValue }

                newValue.groupState = groupState
                newValue.groupCanMembersDecorate = groupDecorate

                return newValue
            })

            return true
        }

        SendMessageComposer(new GroupSavePreferencesComposer(groupData.groupId, groupState, groupDecorate ? 0 : 1))

        return true
    }, [ groupData, groupState, groupDecorate, setGroupData ])

    useEffect(() =>
    {
        setGroupState(groupData.groupState)
        setGroupDecorate(groupData.groupCanMembersDecorate)
    }, [ groupData ])

    useEffect(() =>
    {
        setCloseAction({ action: saveSettings })

        return () => setCloseAction(null)
    }, [ setCloseAction, saveSettings ])
    
    return (
        <div className="flex gap-[21px]">
            <div className="w-full">
                <p className="mb-[5px] text-center text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("group.edit.settings.type.caption") }</p>
                <div className="illumina-previewer flex flex-col gap-5 px-[9px] py-[11px]">
                    { STATES.map((state, index) => (
                        <div key={ index } className="flex gap-2">
                            <div>
                                <input type="radio" className="illumina-input" name="groupState" checked={ (groupState === index) } onChange={ event => setGroupState(index) } />
                                <i className={ `block bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] ${getGroupTypeIcon[index]}` } />
                            </div>
                            <div className="pt-0.5">
                                <p className="mb-[3px] text-sm font-semibold !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText(`group.edit.settings.type.${ state }.label`) }</p>
                                <p className="text-sm">{ LocalizeText(`group.edit.settings.type.${ state }.help`) }</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-full">
                <p className="mb-[5px] text-center text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("group.edit.settings.rights.caption") }</p>
                <div className="illumina-previewer px-[9px] py-[11px]">
                    <div className="mb-[7px] flex items-center gap-2">
                        <input type="checkbox" className="illumina-input" checked={ groupDecorate } onChange={ event => setGroupDecorate(prevValue => !prevValue) } />
                        <p className="mb-[3px] text-sm font-semibold !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("group.edit.settings.rights.caption") }</p>
                    </div>
                    <p className="text-sm">{ LocalizeText("group.edit.settings.rights.members.help") }</p>
                </div>
            </div>
        </div>
    )
}
