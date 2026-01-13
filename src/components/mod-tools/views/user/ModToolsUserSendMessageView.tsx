import { ModMessageMessageComposer } from "@nitrots/nitro-renderer"
import { FC, useState } from "react"
import { ISelectedUser, SendMessageComposer } from "../../../../api"
import { Button, DraggableWindowPosition, NitroCardContentView, NitroCardHeaderView, NitroCardView } from "../../../../common"
import { useNotification } from "../../../../hooks"

interface ModToolsUserSendMessageViewProps
{
    user: ISelectedUser;
    onCloseClick: () => void;
}

export const ModToolsUserSendMessageView: FC<ModToolsUserSendMessageViewProps> = props =>
{
    const { user = null, onCloseClick = null } = props
    const [ message, setMessage ] = useState("")
    const { simpleAlert = null } = useNotification()

    if(!user) return null

    const sendMessage = () =>
    {
        if(message.trim().length === 0)
        {
            simpleAlert("Please write a message to user.", null, null, null, "Error", null)
            
            return
        }

        SendMessageComposer(new ModMessageMessageComposer(user.userId, message, -999))

        onCloseClick()
    }

    return (
        <NitroCardView uniqueKey="mod-tools-user-message" className="illumina-mod-tools-user-message" windowPosition={ DraggableWindowPosition.TOP_LEFT }>
            <NitroCardHeaderView headerText={`Message to: ${user.username}`} onCloseClick={ () => onCloseClick() } />
            <NitroCardContentView>
                <div className="illumina-input mb-1.5 w-[210px] p-1">
                    <textarea className="illumina-scrollbar h-[46px] w-full !text-[13px]" spellCheck={ false } value={ message } placeholder="Type your message here or select one of the predefined texts." onChange={ event => setMessage(event.target.value) }></textarea>
                </div>
                <Button onClick={ sendMessage }>Send message</Button>
            </NitroCardContentView>
        </NitroCardView>
    )
}
