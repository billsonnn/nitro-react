import { MouseEventType } from '@nitrots/nitro-renderer';
import { FC, MouseEvent, PropsWithChildren, useState } from 'react';
import { IBotItem, UnseenItemCategory, attemptBotPlacement } from '../../../../api';
import { LayoutAvatarImageView } from '../../../../common';
import { useInventoryBots, useInventoryUnseenTracker } from '../../../../hooks';
import { InfiniteGrid } from '../../../../layout';

export const InventoryBotItemView: FC<PropsWithChildren<{
    botItem: IBotItem
}>> = props =>
{
    const { botItem = null, children = null, ...rest } = props;
    const [ isMouseDown, setMouseDown ] = useState(false);
    const { selectedBot = null, setSelectedBot = null } = useInventoryBots();
    const { isUnseen = null } = useInventoryUnseenTracker();
    const unseen = isUnseen(UnseenItemCategory.BOT, botItem.botData.id);

    const onMouseEvent = (event: MouseEvent) =>
    {
        switch(event.type)
        {
            case MouseEventType.MOUSE_DOWN:
                setSelectedBot(botItem);
                setMouseDown(true);
                return;
            case MouseEventType.MOUSE_UP:
                setMouseDown(false);
                return;
            case MouseEventType.ROLL_OUT:
                if(!isMouseDown || (selectedBot !== botItem)) return;

                attemptBotPlacement(botItem);
                return;
            case 'dblclick':
                attemptBotPlacement(botItem);
                return;
        }
    };

    return (
        <InfiniteGrid.Item itemActive={ (selectedBot === botItem) } itemUnseen={ unseen } onDoubleClick={ onMouseEvent } onMouseDown={ onMouseEvent } onMouseOut={ onMouseEvent } onMouseUp={ onMouseEvent } { ...rest } className="*:[background-position-y:-32px]">
            <LayoutAvatarImageView direction={ 3 } figure={ botItem.botData.figure } headOnly={ true } />
            { children }
        </InfiniteGrid.Item>
    );
};
