import { MouseEventType } from "@nitrots/nitro-renderer"
import { FC, MouseEvent, PropsWithChildren, useState } from "react"
import { IBotItem, UnseenItemCategory, attemptBotPlacement } from "../../../../api"
import { LayoutAvatarImageView, LayoutGridItem } from "../../../../common"
import { useInventoryBots, useInventoryUnseenTracker } from "../../../../hooks"

export const InventoryBotItemView: FC<PropsWithChildren<{ botItem: IBotItem }>> = props =>
{
    const { botItem = null, children = null, ...rest } = props
    const [ isMouseDown, setMouseDown ] = useState(false)
    const { selectedBot = null, setSelectedBot = null } = useInventoryBots()
    const { isUnseen = null } = useInventoryUnseenTracker()
    const unseen = isUnseen(UnseenItemCategory.BOT, botItem.botData.id)

    const onMouseEvent = (event: MouseEvent) =>
    {
        switch(event.type)
        {
        case MouseEventType.MOUSE_DOWN:
            setSelectedBot(botItem)
            setMouseDown(true)
            return
        case MouseEventType.MOUSE_UP:
            setMouseDown(false)
            return
        case MouseEventType.ROLL_OUT:
            if(!isMouseDown || (selectedBot !== botItem)) return

            attemptBotPlacement(botItem)
            return
        case "dblclick":
            attemptBotPlacement(botItem)
            return
        }
    }

    return (
        <LayoutGridItem className="!w-[43px]" itemActive={ (selectedBot === botItem) } itemAbsolute={ true } itemUnseen={ unseen } onMouseDown={ onMouseEvent } onMouseUp={ onMouseEvent } onMouseOut={ onMouseEvent } onDoubleClick={ onMouseEvent } { ...rest }>
            <div className="relative size-10">
                <LayoutAvatarImageView className="!absolute -left-1.5 -top-3 scale-75 !bg-[-26px_-33px]" figure={ botItem.botData.figure } headOnly={ true } direction={ 3 } /> 
            </div>
            { children }
        </LayoutGridItem>
    )
}
