import { GetRoomEngine, GetSessionDataManager } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { CalendarItemState, GetConfigurationValue, ICalendarItem } from '../../api';
import { Column, Flex, LayoutImage } from '../../common';

interface CalendarItemViewProps
{
    itemId: number;
    state: number;
    active?: boolean;
    product?: ICalendarItem;
    onClick: (itemId: number) => void;
}

export const CalendarItemView: FC<CalendarItemViewProps> = props =>
{
    const { itemId = -1, state = null, product = null, active = false, onClick = null } = props;

    const getFurnitureIcon = (name: string) =>
    {
        let furniData = GetSessionDataManager().getFloorItemDataByName(name);
        let url = null;

        if(furniData) url = GetRoomEngine().getFurnitureFloorIconUrl(furniData.id);
        else
        {
            furniData = GetSessionDataManager().getWallItemDataByName(name);

            if(furniData) url = GetRoomEngine().getFurnitureWallIconUrl(furniData.id);
        }

        return url;
    };

    return (
        <Column center fit pointer className={ `campaign-spritesheet campaign-day-generic-bg rounded calendar-item ${ active ? 'active' : '' }` } onClick={ () => onClick(itemId) }>
            { (state === CalendarItemState.STATE_UNLOCKED) &&
                <Flex center className="campaign-spritesheet unlocked-bg">
                    <Flex center className="campaign-spritesheet campaign-opened">
                        { product &&
                            <LayoutImage imageUrl={ product.customImage ? GetConfigurationValue<string>('image.library.url') + product.customImage : getFurnitureIcon(product.productName) } /> }
                    </Flex>
                </Flex> }
            { (state !== CalendarItemState.STATE_UNLOCKED) &&
                <Flex center className="campaign-spritesheet locked-bg">
                    { (state === CalendarItemState.STATE_LOCKED_AVAILABLE) &&
                        <div className="campaign-spritesheet available" /> }
                    { ((state === CalendarItemState.STATE_LOCKED_EXPIRED) || (state === CalendarItemState.STATE_LOCKED_FUTURE)) &&
                        <div className="campaign-spritesheet unavailable" /> }
                </Flex> }
        </Column>
    );
};
