import { RoomObjectCategory } from "@nitrots/nitro-renderer"
import { FC } from "react"
import { LocalizeText, MessengerRequest } from "../../../../api"
import { Button } from "../../../../common"
import { LayoutTimesView } from "../../../../common/layout/LayoutTimesView"
import { ObjectLocationView } from "../object-location/ObjectLocationView"

export const FriendRequestDialogView: FC<{ roomIndex: number, request: MessengerRequest, hideFriendRequest: (userId: number) => void, requestResponse: (requestId: number, flag: boolean) => void }> = props =>
{
    const { roomIndex = -1, request = null, hideFriendRequest = null, requestResponse = null } = props

    return (
        <ObjectLocationView objectId={ roomIndex } category={ RoomObjectCategory.UNIT }>
            <div className="illumina-card orange relative max-w-[197px] p-[12px_5px_9px_7px]">
                <div className="flex justify-between">
                    <div className="flex">
                        <div className="mr-2.5">
                            <i className="block h-3 w-4 cursor-pointer bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-436px_0px]" />
                        </div>
                        <p className="line-clamp-2 text-clip text-sm font-semibold text-white [text-shadow:_0_1px_0_#EA8000] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("widget.friendrequest.from", [ "username" ], [ request.name ]) }</p>
                    </div>
                    <LayoutTimesView onClick={ event => hideFriendRequest(request.requesterUserId) }/>
                </div>
                <div className="mt-[7px] flex items-center justify-between">
                    <Button variant="underline" className="text-white" onClick={ event => requestResponse(request.requesterUserId, false) }>{ LocalizeText("widget.friendrequest.decline") }</Button>
                    <Button onClick={ event => requestResponse(request.requesterUserId, true) }>
                        <i className="mr-[3px] block h-3.5 w-4 cursor-pointer bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-180px_-83px]" />
                        { LocalizeText("widget.friendrequest.accept") }
                    </Button>
                </div>
                <div className="flex w-full items-center justify-center">
                    <div className="caret-down" />
                </div>
            </div>
        </ObjectLocationView>
    )
}
