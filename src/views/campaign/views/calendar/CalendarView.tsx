import { FC, useCallback, useState } from 'react';
import { GetSessionDataManager, LocalizeText } from '../../../../api';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView, NitroLayoutFlex } from '../../../../layout';
import { CalendarItemState } from '../../common/CalendarItemState';
import { getNumItemsDisplayed } from '../../common/Utils';
import { CalendarItemView } from '../calendar-item/CalendarItemView';
import { CalendarViewProps } from './CalendarView.types';

export const CalendarView: FC<CalendarViewProps> = props =>
{
    const { close = null, campaignName = null, currentDay = null, numDays = null, missedDays = null, openedDays = null, openPackage = null, receivedProducts = null } = props;
    const [selectedDay, setSelectedDay] = useState(currentDay);
    const [index, setIndex] = useState(Math.max(0, selectedDay - 1));

    const getDayState = useCallback((day: number) =>
    {
        if(openedDays.includes(day))
        {
            return CalendarItemState.STATE_UNLOCKED;
        }
        if(day > currentDay)
        {
            return CalendarItemState.STATE_LOCKED_FUTURE;
        }

        if(missedDays.includes(day))
        {
            return CalendarItemState.STATE_LOCKED_EXPIRED;
        }

        return CalendarItemState.STATE_LOCKED_AVAILABLE;
    }, [currentDay, missedDays, openedDays]);

    const dayMessage = useCallback((day: number) =>
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
            default: return LocalizeText('campaign.calendar.info.available.desktop');
        }
    }, [getDayState]);

    const onClickNext = useCallback(() =>
    {
        const nextDay = selectedDay + 1;

        if((nextDay) === numDays) return;

        setSelectedDay(nextDay);

        if((index + getNumItemsDisplayed()) < nextDay + 1)
        {
            setIndex(index + 1);
        }

    }, [index, numDays, selectedDay]);

    const onClickPrev = useCallback(() =>
    {
        const prevDay = selectedDay - 1;

        if((prevDay < 0)) return;

        setSelectedDay(prevDay);

        if(index > prevDay)
        {
            setIndex(index - 1);
        }
    }, [index, selectedDay]);

    const onClickItem = useCallback((item: number) =>
    {
        if(selectedDay === item)
        {
            //handle opening
            const state = getDayState(item);
            if(state === CalendarItemState.STATE_LOCKED_AVAILABLE) openPackage(item, false);
        }
        else
        {
            setSelectedDay(item);
        }
    }, [getDayState, openPackage, selectedDay]);

    const forceOpen = useCallback(() =>
    {
        const id = selectedDay;
        const state = getDayState(id);
        if(GetSessionDataManager().isModerator && state !== CalendarItemState.STATE_UNLOCKED)
        {
            openPackage(id, true);
        }
    }, [getDayState, openPackage, selectedDay]);

    return (
        <NitroCardView className="nitro-campaign-calendar">
            <NitroCardHeaderView headerText={LocalizeText(`campaign.calendar.${campaignName}.title`)} onCloseClick={close} />
            <NitroCardContentView>
                <div className="d-flex justify-content-between mx-5">
                    <div className="text-black">
                        <h3>{LocalizeText('campaign.calendar.heading.day', ['number'], [(selectedDay + 1).toString()])}</h3>
                        <p>{dayMessage(selectedDay)}</p>
                    </div>
                    {GetSessionDataManager().isModerator &&
                        <button className="btn btn-sm btn-danger my-4" onClick={forceOpen}>Force open</button>
                    }
                </div>
                <div className="button-container">
                    
                    
                </div>
                <NitroLayoutFlex className="h-100 align-items-center" gap={1}>
                    <div className="calendar-prev cursor-pointer" onClick={onClickPrev} />
                    {
                        [...Array(getNumItemsDisplayed())].map((e, i) =>
                        {
                            const day = index + i;
                            return <CalendarItemView key={i} state={getDayState(day)} active={selectedDay === day} onClick={onClickItem} id={day} productName={receivedProducts.has(day) ? receivedProducts.get(day) : null} />
                        })
                    }
                    <div className="calendar-next cursor-pointer" onClick={onClickNext} />
                </NitroLayoutFlex>
            </NitroCardContentView>
        </NitroCardView>
    )
}
