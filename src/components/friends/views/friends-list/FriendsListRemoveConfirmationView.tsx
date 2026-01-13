import { FC } from "react"
import { LocalizeText } from "../../../../api"
import { Button, NitroCardContentView, NitroCardHeaderView, NitroCardView } from "../../../../common"

interface FriendsRemoveConfirmationViewProps
{
    selectedFriendsIds: number[];
    removeFriendsText: string;
    removeSelectedFriends: () => void;
    onCloseClick: () => void;
}

export const FriendsRemoveConfirmationView: FC<FriendsRemoveConfirmationViewProps> = props =>
{
    const { selectedFriendsIds = null, removeFriendsText = null, removeSelectedFriends = null, onCloseClick = null } = props

    return (
        <NitroCardView uniqueKey="friends-remove-confirmation" className="illumina-friends-remove-confirmation w-[170px]">
            <NitroCardHeaderView headerText={ LocalizeText("friendlist.removefriendconfirm.title") } onCloseClick={ onCloseClick } />
            <NitroCardContentView className="text-black">
                <div className="illumina-previewer h-[143px] p-3">
                    <p className="text-sm">{ removeFriendsText }</p>
                </div>
                <div className="mt-2 flex items-center gap-2">
                    <Button variant="underline" className="w-full" onClick={ onCloseClick }>{ LocalizeText("generic.cancel") }</Button>
                    <Button className="w-full" disabled={ (selectedFriendsIds.length === 0) } onClick={ removeSelectedFriends }>{ LocalizeText("generic.ok") }</Button>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    )
}
