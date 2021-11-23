import { CampaignCalendarData, CampaignCalendarDataMessageEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { AddEventLinkTracker, RemoveLinkEventTracker } from '../../api';
import { CreateMessageHook } from '../../hooks';
import { CalendarView } from './views/calendar/CalendarView';

export const CampaignView: FC<{}> = props =>
{
    const [ calendarData, setCalendarData ] = useState<CampaignCalendarData>(null);
    const [ isCalendarOpen, setCalendarOpen ] = useState(false);
    
    const onCampaignCalendarDataMessageEvent = useCallback((event: CampaignCalendarDataMessageEvent) =>
    {
        const parser = event.getParser();

        if(!parser) return;

        setCalendarData(parser.calendarData);
    }, []);

    CreateMessageHook(CampaignCalendarDataMessageEvent, onCampaignCalendarDataMessageEvent);

    const onLinkReceived = useCallback((link: string) =>
    {
        const value = link.split('/');

        if(value.length < 2) return;

        switch(value[1])
        {
            case 'calendar':
                setCalendarOpen(true);
                break;
        }
    }, []);

    useEffect(() =>
    {
        const linkTracker = { linkReceived: onLinkReceived, eventUrlPrefix: 'openView/' };
        AddEventLinkTracker(linkTracker);

        return () =>
        {
            RemoveLinkEventTracker(linkTracker);
        }
    }, [onLinkReceived]);

    const onCalendarClose = useCallback(() =>
    {
        setCalendarOpen(false);
    }, []);

    return (
        <>
            {(calendarData && isCalendarOpen) && 
                <CalendarView close={onCalendarClose} campaignName={calendarData.campaignName} currentDay={calendarData.currentDay} numDays={calendarData.campaignDays} openedDays={calendarData.openedDays} missedDays={calendarData.missedDays}/>
            }
        </>
    )
}
