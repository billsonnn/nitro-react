import { FlatControllerAddedEvent, FlatControllerRemovedEvent, FlatControllersEvent, RemoveAllRightsMessageComposer, RoomGiveRightsComposer, RoomTakeRightsComposer, RoomUsersWithRightsComposer } from "@nitrots/nitro-renderer"
import { FC, useEffect, useState } from "react"
import { GetUserProfile, IRoomData, LocalizeText, MessengerFriend, SendMessageComposer } from "../../../../api"
import { Button } from "../../../../common"
import { useFriends, useMessageEvent } from "../../../../hooks"

interface NavigatorRoomSettingsTabViewProps
{
    roomData: IRoomData;
    handleChange: (field: string, value: string | number | boolean) => void;
}

export const NavigatorRoomSettingsRightsTabView: FC<NavigatorRoomSettingsTabViewProps> = props =>
{
    const { roomData = null } = props
    const [ usersWithRights, setUsersWithRights ] = useState<Map<number, string>>(new Map())
    const { friends = [] } = useFriends()
    
    const friendsWithoutRights = friends.map((friend: MessengerFriend) => friend).filter(friend => friend.id !== -1 && !Array.from(usersWithRights.keys()).includes(friend.id))

    useMessageEvent<FlatControllersEvent>(FlatControllersEvent, event =>
    {
        const parser = event.getParser()

        if(!roomData || (roomData.roomId !== parser.roomId)) return

        setUsersWithRights(parser.users)
    })

    useMessageEvent<FlatControllerAddedEvent>(FlatControllerAddedEvent, event =>
    {
        const parser = event.getParser()

        if(!roomData || (roomData.roomId !== parser.roomId)) return

        setUsersWithRights(prevValue =>
        {
            const newValue = new Map(prevValue)

            newValue.set(parser.data.userId, parser.data.userName)

            return newValue
        })
    })

    useMessageEvent<FlatControllerRemovedEvent>(FlatControllerRemovedEvent, event =>
    {
        const parser = event.getParser()

        if(!roomData || (roomData.roomId !== parser.roomId)) return

        setUsersWithRights(prevValue =>
        {
            const newValue = new Map(prevValue)

            newValue.delete(parser.userId)

            return newValue
        }) 
    })

    useEffect(() =>
    {
        SendMessageComposer(new RoomUsersWithRightsComposer(roomData.roomId))
    }, [ roomData.roomId ])

    return (
        <div className="mt-2 flex h-full justify-between">
            <div className="flex flex-col">
                <p className="mb-1 text-sm">
                    { LocalizeText("navigator.flatctrls.userswithrights", [ "displayed", "total" ], [ usersWithRights.size.toString(), usersWithRights.size.toString() ]) }
                </p>
                <div className="illumina-input flex w-[150px] flex-1 flex-col p-1">
                    <div className="illumina-scrollbar mb-1.5 h-[336px]">
                        { Array.from(usersWithRights.entries()).map(([ id, name ], index) => (
                            <div key={ index } className="cursor-pointer overflow-hidden p-1 odd:bg-[#EEEEEE] dark:odd:bg-[#27251F]">
                                <p className="text-sm" onClick={ event => SendMessageComposer(new RoomTakeRightsComposer(id)) }> { name }</p>
                            </div>
                        ))}
                    </div>
                    <Button className="w-full" onClick={ event => SendMessageComposer(new RemoveAllRightsMessageComposer(roomData.roomId)) } >
                        { LocalizeText("navigator.flatctrls.clear") }
                    </Button>
                </div>
            </div>
            <div className="flex flex-col">
                <p className="mb-1 text-sm">
                    { LocalizeText("navigator.flatctrls.friends", [ "displayed", "total" ], [ friendsWithoutRights.length.toString(), friendsWithoutRights.length.toString() ]) }
                </p>
                <div className="illumina-input flex w-[150px] flex-1 flex-col p-1">
                    <div className="illumina-scrollbar mb-1.5 h-[336px]">
                        { friendsWithoutRights && friendsWithoutRights.map((friend: MessengerFriend, index) => (
                            <div key={ index } className="flex cursor-pointer items-center gap-1 overflow-hidden p-1 odd:bg-[#EEEEEE] dark:odd:bg-[#27251F]">
                                <i className="block h-3 w-4 cursor-pointer bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-436px_0px]" onClick={ event => GetUserProfile(friend.id) } />
                                <p className="text-sm" onClick={ event => SendMessageComposer(new RoomGiveRightsComposer(friend.id)) }> { friend.name }</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
