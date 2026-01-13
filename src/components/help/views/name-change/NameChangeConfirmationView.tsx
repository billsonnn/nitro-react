import { ChangeUserNameMessageComposer, UserNameChangeMessageEvent } from "@nitrots/nitro-renderer"
import { FC, useState } from "react"
import { GetSessionDataManager, LocalizeText, NotificationAlertType, SendMessageComposer } from "../../../../api"
import { Button } from "../../../../common"
import { useMessageEvent, useNotification } from "../../../../hooks"
import { NameChangeLayoutViewProps } from "./NameChangeView.types"

export const NameChangeConfirmationView:FC<NameChangeLayoutViewProps> = props =>
{
    const { username = "", onAction = null } = props
    const [ isConfirming, setIsConfirming ] = useState<boolean>(false)
    const { simpleAlert = null } = useNotification()

    const confirm = () =>
    {
        if(isConfirming) return

        setIsConfirming(true)
        SendMessageComposer(new ChangeUserNameMessageComposer(username))
        simpleAlert(LocalizeText("help.tutorial.name.changed", [ "name" ], [ username ]), NotificationAlertType.ALERT, null, null, LocalizeText("generic.alert.title"))
    }
    
    useMessageEvent<UserNameChangeMessageEvent>(UserNameChangeMessageEvent, event =>
    {
        const parser = event.getParser()

        if(!parser) return

        if(parser.webId !== GetSessionDataManager().userId) return

        onAction("close")
    })

    return (
        <div className="flex h-full flex-col">
            <p className="pb-[26px] text-center text-sm">{ LocalizeText("tutorial.name_change.info.confirm") }</p>
            <div className="h-100 flex flex-col items-center gap-1">
                <p className="pb-4 text-sm">{ LocalizeText("tutorial.name_change.confirm") }</p>
                <div className="text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ username }</div>
            </div>
            <div className="mt-[18px] flex items-center justify-center gap-5">
                <Button className="h-[43px]" disabled={ isConfirming } onClick={ confirm }>{ LocalizeText("generic.ok") }</Button>
                <Button className="h-[43px]" onClick={ () => onAction("close") }>{ LocalizeText("cancel") }</Button>
            </div>
        </div>
    )
}
