import { CampaignCalendarData, CampaignCalendarDataMessageEvent, CampaignCalendarDoorOpenedMessageEvent, OpenCampaignCalendarDoorAsStaffComposer, OpenCampaignCalendarDoorComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { AddEventLinkTracker, RemoveLinkEventTracker } from '../../api';
import { BatchUpdates, CreateMessageHook, SendMessageHook } from '../../hooks';
import { CalendarView } from './views/calendar/CalendarView';

export const CampaignView: FC<{}> = props =>
{
    const [ calendarData, setCalendarData ] = useState<CampaignCalendarData>(null);
    const [ lastOpenAttempt, setLastOpenAttempt ] = useState<number>(-1);
    const [ receivedProducts, setReceivedProducts ] = useState<Map<number, string>>(new Map());
    const [ isCalendarOpen, setCalendarOpen ] = useState(false);
    
    const onCampaignCalendarDataMessageEvent = useCallback((event: CampaignCalendarDataMessageEvent) =>
    {
        const parser = event.getParser();

        if(!parser) return;
        setCalendarData(parser.calendarData);
    }, []);

    CreateMessageHook(CampaignCalendarDataMessageEvent, onCampaignCalendarDataMessageEvent);

    const onCampaignCalendarDoorOpenedMessageEvent = useCallback((event: CampaignCalendarDoorOpenedMessageEvent) =>
    {
        const parser = event.getParser();

        if(!parser) return;

        const lastAttempt = lastOpenAttempt;

        if(parser.doorOpened)
        {
            BatchUpdates(() =>
            {
                setCalendarData(prev => 
                    {
                        const copy = prev.clone();
                        copy.openedDays.push(lastOpenAttempt);
                        
                        return copy;
                    });
        
                    setReceivedProducts(prev =>
                    {
                        const copy = new Map(prev);
                        copy.set(lastAttempt, parser.furnitureClassName);
                        
                        return copy;
                    });
            });
        }

        setLastOpenAttempt(-1);
    }, [lastOpenAttempt]);

    CreateMessageHook(CampaignCalendarDoorOpenedMessageEvent, onCampaignCalendarDoorOpenedMessageEvent);

    const openPackage = useCallback((id: number, asStaff = false) =>
    {
        if(!calendarData) return;

        setLastOpenAttempt(id);

        if(asStaff)
        {
            SendMessageHook(new OpenCampaignCalendarDoorAsStaffComposer(calendarData.campaignName, id));
        }

        else
        {
            SendMessageHook(new OpenCampaignCalendarDoorComposer(calendarData.campaignName, id));
        }
    }, [calendarData]);

    const onCalendarClose = useCallback(() =>
    {
        setCalendarOpen(false);
    }, []);

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

    return (
        <>
            {(calendarData && isCalendarOpen) && 
                <CalendarView close={onCalendarClose} campaignName={calendarData.campaignName} currentDay={calendarData.currentDay} numDays={calendarData.campaignDays} openedDays={calendarData.openedDays} missedDays={calendarData.missedDays} openPackage={openPackage} receivedProducts={receivedProducts} />
            }
        </>
    )
}
