import { FC, useMemo } from "react"
import { AvatarInfoName, GetSessionDataManager, MessengerFriend } from "../../../../../api"
import { ContextMenuView } from "../../context-menu/ContextMenuView"

interface AvatarInfoWidgetNameViewProps
{
    nameInfo: AvatarInfoName;
    onClose: () => void;
}

export const AvatarInfoWidgetNameView: FC<AvatarInfoWidgetNameViewProps> = props =>
{
    const { nameInfo = null, onClose = null } = props

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ "flex items-center !min-w-fit !p-[6px_15px_8px] text-[#636363] dark:text-[#737067] [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]" ]

        if(nameInfo.isFriend) newClassNames.push("green !text-white ![text-shadow:_0_1px_0_#95B555]")

        return newClassNames
    }, [ nameInfo ])

    const getUserRelationshipPosition = () =>
    {
        let position = "bg-[0px_0px]"

        if(nameInfo.relationshipStatus === MessengerFriend.RELATIONSHIP_HEART)
        {
            position = "bg-[-292px_-23px]"
        }
        else if(nameInfo.relationshipStatus === MessengerFriend.RELATIONSHIP_SMILE)
        {
            position = "bg-[-320px_-23px]"
        }
        else if(nameInfo.relationshipStatus === MessengerFriend.RELATIONSHIP_BOBBA)
        {
            position = "bg-[-306px_-23px]"
        }

        return position
    }

    return (
        <ContextMenuView objectId={ nameInfo.roomIndex } category={ nameInfo.category } userType={ nameInfo.userType } fades={ (nameInfo.id !== GetSessionDataManager().userId) } classNames={ getClassNames } onClose={ onClose }>
            <div className="flex items-center gap-1">
                {nameInfo.relationshipStatus !== 0 &&
                    <i className={`h-3.5 w-[13px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] ${ getUserRelationshipPosition() }`} /> }
                <p className="text-xs font-semibold">
                    { nameInfo.name }
                </p>
            </div>
            <div className="caret-down" />
        </ContextMenuView>
    )
}
