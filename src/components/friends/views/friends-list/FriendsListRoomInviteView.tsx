import { FC, useState } from "react"
import { LocalizeText } from "../../../../api"
import { Button, NitroCardContentView, NitroCardHeaderView, NitroCardView } from "../../../../common"

interface FriendsRoomInviteViewProps
{
    selectedFriendsIds: number[];
    onCloseClick: () => void;
    sendRoomInvite: (message: string) => void;
}

export const FriendsRoomInviteView: FC<FriendsRoomInviteViewProps> = props =>
{
    const { selectedFriendsIds = null, onCloseClick = null, sendRoomInvite = null } = props
    const [ roomInviteMessage, setRoomInviteMessage ] = useState<string>("")

    return (
        <NitroCardView uniqueKey="friends-room-invite" className="illumina-friends-room-invite">
            <NitroCardHeaderView headerText={ LocalizeText("friendlist.invite.title") } onCloseClick={ onCloseClick } />
            <NitroCardContentView className="text-black">
                <div className="illumina-input p-1">
                    <textarea className="illumina-scrollbar h-[95px] w-[195px]" spellCheck={ false } value={ roomInviteMessage } maxLength={ 255 } onChange={ event => setRoomInviteMessage(event.target.value) }></textarea>
                </div>
                <div className="flex items-center gap-2 pt-1.5">
                    <Button variant="success" className="w-full" disabled={ ((roomInviteMessage.length === 0) || (selectedFriendsIds.length === 0)) } onClick={ () => sendRoomInvite(roomInviteMessage) }>{ LocalizeText("friendlist.invite.send") }</Button>
                    <Button className="w-full" onClick={ onCloseClick }>{ LocalizeText("generic.cancel") }</Button>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    )
}
