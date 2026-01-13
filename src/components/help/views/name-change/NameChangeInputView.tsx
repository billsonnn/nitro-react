import { CheckUserNameMessageComposer, CheckUserNameResultMessageEvent } from "@nitrots/nitro-renderer"
import { FC, useState } from "react"
import { LocalizeText, SendMessageComposer } from "../../../../api"
import { Button } from "../../../../common"
import { useMessageEvent } from "../../../../hooks"
import { NameChangeLayoutViewProps } from "./NameChangeView.types"

const AVAILABLE: number = 0
const TOO_SHORT: number = 2
const TOO_LONG: number = 3
const NOT_VALID: number = 4
const TAKEN_WITH_SUGGESTIONS: number = 5
const DISABLED: number = 6

export const NameChangeInputView:FC<NameChangeLayoutViewProps> = props =>
{
    const { onAction = null } = props
    const [ newUsername, setNewUsername ] = useState<string>("")
    const [ canProceed, setCanProceed ] = useState<boolean>(false)
    const [ isChecking, setIsChecking ] = useState<boolean>(false)
    const [ errorCode, setErrorCode ] = useState<string>(null)
    const [ suggestions, setSuggestions ] = useState<string[]>([])

    const check = () =>
    {
        if(newUsername === "") return

        setCanProceed(false)
        setSuggestions([])
        setErrorCode(null)
        setIsChecking(true)

        SendMessageComposer(new CheckUserNameMessageComposer(newUsername))
    }

    const handleUsernameChange = (username: string) =>
    {
        setCanProceed(false)
        setSuggestions([])
        setErrorCode(null)
        setNewUsername(username)
    }
    
    useMessageEvent<CheckUserNameResultMessageEvent>(CheckUserNameResultMessageEvent, event =>
    {
        setIsChecking(false)

        const parser = event.getParser()

        if(!parser) return

        switch(parser.resultCode)
        {
        case AVAILABLE:
            setCanProceed(true)
            break
        case TOO_SHORT:
            setErrorCode("short")
            break
        case TOO_LONG:
            setErrorCode("long")
            break
        case NOT_VALID:
            setErrorCode("invalid")
            break
        case TAKEN_WITH_SUGGESTIONS:
            setSuggestions(parser.nameSuggestions)
            setErrorCode("taken")
            break
        case DISABLED:
            setErrorCode("change_not_allowed")
        }
    })

    return (
        <div className="flex h-full flex-col">
            <div className="flex-1">
                <p className="pb-4 text-sm">{ LocalizeText("tutorial.name_change.info.select") }</p>
                <div className="flex items-center gap-2">
                    <input type="text" className="illumina-input h-[25px] px-[11px]" value={ newUsername } onChange={ event => handleUsernameChange(event.target.value) } />
                    <Button onClick={ check }>{ LocalizeText("tutorial.name_change.check") }</Button>
                </div>
                <div className="pt-[9px]">
                    { isChecking &&
                        <p className="text-sm">{ LocalizeText("help.tutorial.name.wait_while_checking") }</p> }
                    { errorCode &&
                        <p className="text-sm">{ LocalizeText(`help.tutorial.name.${ errorCode }`, [ "name" ], [ newUsername ]) }</p> }
                    { canProceed &&
                        <p className="text-sm">{ LocalizeText("help.tutorial.name.available", [ "name" ], [ newUsername ]) }</p> }
                    { suggestions &&
                        <div className="flex flex-wrap gap-x-[9px] gap-y-[3px] pt-1">
                            { suggestions.map((suggestion, index) => <div key={ index } className="cursor-pointer bg-[#C1EAF6] p-0.5 pt-[3px] text-sm hover:bg-[#9DD5E5] dark:bg-[#191512] dark:hover:bg-[#33312b]" onClick={ () => handleUsernameChange(suggestion) }>{ suggestion }</div>) }
                        </div> }
                </div>
            </div>
            <div className="flex justify-between">
                <Button disabled={ !canProceed } onClick={ () => onAction("confirmation", newUsername) }>{ LocalizeText("tutorial.name_change.pick") }</Button>
                <Button onClick={ () => onAction("close") }>{ LocalizeText("cancel") }</Button>
            </div>
        </div>
    )
}
