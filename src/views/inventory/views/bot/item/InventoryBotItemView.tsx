import { MouseEventType } from 'nitro-renderer';
import { FC, MouseEvent, useCallback, useState } from 'react';
import { AvatarImageView } from '../../../../shared/avatar-image/AvatarImageView';
import { useInventoryContext } from '../../../context/InventoryContext';
import { InventoryBotActions } from '../../../reducers/InventoryBotReducer';
import { attemptBotPlacement } from '../../../utils/BotUtilities';
import { InventoryBotItemViewProps } from './InventoryBotItemView.types';

export const InventoryBotItemView: FC<InventoryBotItemViewProps> = props =>
{
    const { botItem } = props;
    const { botState = null, dispatchBotState = null } = useInventoryContext();
    const [ isMouseDown, setMouseDown ] = useState(false);
    const isActive = (botState.botItem === botItem);

    const onMouseEvent = useCallback((event: MouseEvent) =>
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
    }, [ isActive, isMouseDown, botItem, dispatchBotState ]);

    return (
        <div className="col pe-1 pb-1 inventory-bot-item-container">
            <div className={ 'position-relative border border-2 rounded inventory-bot-item cursor-pointer ' + (isActive ? 'active' : '') } onMouseDown={ onMouseEvent } onMouseUp={ onMouseEvent } onMouseOut={ onMouseEvent }>
                <AvatarImageView figure={ botItem.botData.figure } direction={ 3 } headOnly={ true } />
            </div>
        </div>
    );
}
