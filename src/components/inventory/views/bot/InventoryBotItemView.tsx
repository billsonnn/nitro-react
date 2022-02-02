import { MouseEventType } from '@nitrots/nitro-renderer';
import { FC, MouseEvent, useEffect, useState } from 'react';
import { LayoutGridItem } from '../../../../common/layout/LayoutGridItem';
import { AvatarImageView } from '../../../../views/shared/avatar-image/AvatarImageView';
import { BotItem } from '../../common/BotItem';
import { attemptBotPlacement } from '../../common/BotUtilities';
import { useInventoryContext } from '../../InventoryContext';
import { InventoryBotActions } from '../../reducers/InventoryBotReducer';

export interface InventoryBotItemViewProps
{
    botItem: BotItem;
}

export const InventoryBotItemView: FC<InventoryBotItemViewProps> = props =>
{
    const { botItem } = props;
    const [ isMouseDown, setMouseDown ] = useState(false);
    const { botState = null, dispatchBotState = null } = useInventoryContext();
    const isActive = (botState.botItem === botItem);

    const onMouseEvent = (event: MouseEvent) =>
    {
        switch(event.type)
        {
            case MouseEventType.MOUSE_DOWN:
                dispatchBotState({
                    type: InventoryBotActions.SET_BOT_ITEM,
                    payload: { botItem }
                });

                setMouseDown(true);
                return;
            case MouseEventType.MOUSE_UP:
                setMouseDown(false);
                return;
            case MouseEventType.ROLL_OUT:
                if(!isMouseDown || !isActive) return;

                attemptBotPlacement(botItem);
                return;
        }
    }

    useEffect(() =>
    {
        if(!isActive) return;

        botItem.isUnseen = false;
    }, [ isActive, botItem ]);

    return (
        <LayoutGridItem itemActive={ isActive } itemUnseen={ botItem.isUnseen } onMouseDown={ onMouseEvent } onMouseUp={ onMouseEvent } onMouseOut={ onMouseEvent }>
            <AvatarImageView figure={ botItem.botData.figure } direction={ 3 } headOnly={ true } />
        </LayoutGridItem>
    );
}
