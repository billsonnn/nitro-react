import { GetSessionDataManager } from '@nitrots/nitro-renderer';
import { FC, useState } from 'react';
import { CalendarItemState, ICalendarItem, LocalizeText } from '../../api';
import { Button, Column, Grid, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../common';
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
    };

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
    };

    const onClickNext = () =>
    {
        const nextDay = (selectedDay + 1);

        if(nextDay === numDays) return;

        setSelectedDay(nextDay);

        if((index + TOTAL_SHOWN_ITEMS) < (nextDay + 1)) setIndex(index + 1);
    };

    const onClickPrev = () =>
    {
        const prevDay = (selectedDay - 1);

        if(prevDay < 0) return;

        setSelectedDay(prevDay);

        if(index > prevDay) setIndex(index - 1);
    };

    const onClickItem = (item: number) =>
    {
        if(selectedDay === item)
        {
            const state = getDayState(item);

            if(state === CalendarItemState.STATE_LOCKED_AVAILABLE) openPackage(item, false);

            return;
        }

        setSelectedDay(item);
    };

    const forceOpen = () =>
    {
        const id = selectedDay;
        const state = getDayState(id);

        if(state !== CalendarItemState.STATE_UNLOCKED) openPackage(id, true);
    };

    return (
        <NitroCardView className="nitro-campaign-calendar" theme="primary-slim">
            <NitroCardHeaderView headerText={ LocalizeText(`campaign.calendar.${ campaignName }.title`) } onCloseClick={ onClose } />
            <NitroCardContentView>
                <Grid alignItems="center" fullHeight={ false } justifyContent="between">
                    <Column size={ 1 } />
                    <Column size={ 10 }>
                        <div className="flex items-center gap-1 justify-between">
                            <div className="flex flex-col gap-1">
                                <Text fontSize={ 3 }>{ LocalizeText('campaign.calendar.heading.day', [ 'number' ], [ (selectedDay + 1).toString() ]) }</Text>
                                <Text>{ dayMessage(selectedDay) }</Text>
                            </div>
                            <div>
                                { GetSessionDataManager().isModerator &&
                                    <Button variant="danger" onClick={ forceOpen }>Force open</Button> }
                            </div>
                        </div>
                    </Column>
                    <Column size={ 1 } />
                </Grid>
                <div className="flex h-full gap-2">
                    <div className="flex items-center justify-center">
                        <div className="campaign-spritesheet prev cursor-pointer" onClick={ onClickPrev } />
                    </div>
                    <Column center fullWidth>
                        <Grid fit columnCount={ TOTAL_SHOWN_ITEMS } gap={ 1 }>
                            { [ ...Array(TOTAL_SHOWN_ITEMS) ].map((e, i) =>
                            {
                                const day = (index + i);

                                return (
                                    <Column key={ i } overflow="hidden">
                                        <CalendarItemView active={ (selectedDay === day) } itemId={ day } product={ receivedProducts.has(day) ? receivedProducts.get(day) : null } state={ getDayState(day) } onClick={ onClickItem } />
                                    </Column>
                                );
                            }) }
                        </Grid>
                    </Column>
                    <div className="flex items-center justify-center">
                        <div className="campaign-spritesheet next cursor-pointer" onClick={ onClickNext } />
                    </div>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    );
};
