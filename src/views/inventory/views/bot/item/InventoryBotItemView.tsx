import { MouseEventType } from '@nitrots/nitro-renderer';
import { FC, MouseEvent, useCallback, useEffect, useState } from 'react';
import { NitroCardGridItemView } from '../../../../../layout/card/grid/item/NitroCardGridItemView';
import { AvatarImageView } from '../../../../shared/avatar-image/AvatarImageView';
import { attemptBotPlacement } from '../../../common/BotUtilities';
import { useInventoryContext } from '../../../context/InventoryContext';
import { InventoryBotActions } from '../../../reducers/InventoryBotReducer';
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

    useEffect(() =>
    {
        if(!isActive) return;

        botItem.isUnseen = false;
    }, [ isActive, botItem ]);

    return (
        <NitroCardGridItemView itemActive={ isActive } itemUnseen={ botItem.isUnseen } onMouseDown={ onMouseEvent } onMouseUp={ onMouseEvent } onMouseOut={ onMouseEvent }>
            <AvatarImageView figure={ botItem.botData.figure } direction={ 3 } headOnly={ true } />
        </NitroCardGridItemView>
    );
}
