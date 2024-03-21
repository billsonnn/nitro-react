import { GetSessionDataManager } from '@nitrots/nitro-renderer';
import { FC, useState } from 'react';
import { CalendarItemState, ICalendarItem, LocalizeText } from '../../api';
import { Base, Button, Column, Flex, Grid, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../common';
import { CalendarItemView } from './CalendarItemView';

interface CalendarViewProps
{
    onClose(): void;
    openPackage(id: number, asStaff: boolean): void;
    receivedProducts: Map<number, ICalendarItem>;
    campaignName: string;
    currentDay: number;
    numDays: number;
    openedDays: number[];
    missedDays: number[];
}

const TOTAL_SHOWN_ITEMS = 5;

export const CalendarView: FC<CalendarViewProps> = props =>
{
    const { onClose = null, campaignName = null, currentDay = null, numDays = null, missedDays = null, openedDays = null, openPackage = null, receivedProducts = null } = props;
    const [ selectedDay, setSelectedDay ] = useState(currentDay);
    const [ index, setIndex ] = useState(Math.max(0, (selectedDay - 1)));

    const getDayState = (day: number) =>
    {
        if(openedDays.includes(day)) return CalendarItemState.STATE_UNLOCKED;

        if(day > currentDay) return CalendarItemState.STATE_LOCKED_FUTURE;

        if(missedDays.includes(day)) return CalendarItemState.STATE_LOCKED_EXPIRED;

        return CalendarItemState.STATE_LOCKED_AVAILABLE;
    }

    const dayMessage = (day: number) =>
    {
        const state = getDayState(day);

        switch(state)
        {
            case CalendarItemState.STATE_UNLOCKED:
                return LocalizeText('campaign.calendar.info.unlocked');
            case CalendarItemState.STATE_LOCKED_FUTURE:
                return LocalizeText('campaign.calendar.info.future');
            case CalendarItemState.STATE_LOCKED_EXPIRED:
                return LocalizeText('campaign.calendar.info.expired');
            default:
                return LocalizeText('campaign.calendar.info.available.desktop');
        }
    }

    const onClickNext = () =>
    {
        const nextDay = (selectedDay + 1);

        if(nextDay === numDays) return;

        setSelectedDay(nextDay);

        if((index + TOTAL_SHOWN_ITEMS) < (nextDay + 1)) setIndex(index + 1);
    }

    const onClickPrev = () =>
    {
        const prevDay = (selectedDay - 1);

        if(prevDay < 0) return;

        setSelectedDay(prevDay);

        if(index > prevDay) setIndex(index - 1);
    }

    const onClickItem = (item: number) =>
    {
        if(selectedDay === item)
        {
            const state = getDayState(item);

            if(state === CalendarItemState.STATE_LOCKED_AVAILABLE) openPackage(item, false);

            return;
        }
        
        setSelectedDay(item);
    }

    const forceOpen = () =>
    {
        const id = selectedDay;
        const state = getDayState(id);

        if(state !== CalendarItemState.STATE_UNLOCKED) openPackage(id, true);
    }

    return (
        <NitroCardView className="nitro-campaign-calendar" theme="primary-slim">
            <NitroCardHeaderView headerText={ LocalizeText(`campaign.calendar.${ campaignName }.title`) } onCloseClick={ onClose } />
            <NitroCardContentView>
                <Grid fullHeight={ false } justifyContent="between" alignItems="center">
                    <Column size={ 1 } />
                    <Column size={ 10 }>
                        <Flex justifyContent="between" alignItems="center" gap={ 1 }>
                            <Column gap={ 1 }>
                                <Text fontSize={ 3 }>{ LocalizeText('campaign.calendar.heading.day', [ 'number' ], [ (selectedDay + 1).toString() ]) }</Text>
                                <Text>{ dayMessage(selectedDay) }</Text>
                            </Column>
                            <div>
                                { GetSessionDataManager().isModerator &&
                                    <Button variant="danger" onClick={ forceOpen }>Force open</Button> }
                            </div>
                        </Flex>
                    </Column>
                    <Column size={ 1 } />
                </Grid>
                <Flex fullHeight gap={ 2 }>
                    <Flex center>
                        <Base pointer className="campaign-spritesheet prev" onClick={ onClickPrev } />
                    </Flex>
                    <Column center fullWidth>
                        <Grid fit columnCount={ TOTAL_SHOWN_ITEMS } gap={ 1 }>
                            { [ ...Array(TOTAL_SHOWN_ITEMS) ].map((e, i) =>
                            {
                                const day = (index + i);
                                    
                                return (
                                    <Column key={ i } overflow="hidden">
                                        <CalendarItemView itemId={ day } state={ getDayState(day) } active={ (selectedDay === day) } product={ receivedProducts.has(day) ? receivedProducts.get(day) : null } onClick={ onClickItem } />
                                    </Column>
                                );
                            }) }
                        </Grid>
                    </Column>
                    <Flex center>
                        <Base pointer className="campaign-spritesheet next" onClick={ onClickNext } />
                    </Flex>
                </Flex>
            </NitroCardContentView>
        </NitroCardView>
    )
}
