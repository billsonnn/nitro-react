import { CampaignCalendarData, CampaignCalendarDataMessageEvent, CampaignCalendarDoorOpenedMessageEvent, ILinkEventTracker, OpenCampaignCalendarDoorAsStaffComposer, OpenCampaignCalendarDoorComposer } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { AddEventLinkTracker, CalendarItem, RemoveLinkEventTracker, SendMessageComposer } from '../../api';
import { useMessageEvent } from '../../hooks';
import { CalendarView } from './CalendarView';

export const CampaignView: FC<{}> = props =>
{
    const [ calendarData, setCalendarData ] = useState<CampaignCalendarData>(null);
    const [ lastOpenAttempt, setLastOpenAttempt ] = useState<number>(-1);
    const [ receivedProducts, setReceivedProducts ] = useState<Map<number, CalendarItem>>(new Map());
    const [ isCalendarOpen, setCalendarOpen ] = useState(false);

    const openPackage = (id: number, asStaff = false) =>
    {
        if(!calendarData) return;

        setLastOpenAttempt(id);

        if(asStaff)
        {
            SendMessageComposer(new OpenCampaignCalendarDoorAsStaffComposer(calendarData.campaignName, id));
        }

        else
        {
            SendMessageComposer(new OpenCampaignCalendarDoorComposer(calendarData.campaignName, id));
        }
    }

    useMessageEvent<CampaignCalendarDataMessageEvent>(CampaignCalendarDataMessageEvent, event =>
    {
        const parser = event.getParser();

        if(!parser) return;
        
        setCalendarData(parser.calendarData);
    });

    useMessageEvent<CampaignCalendarDoorOpenedMessageEvent>(CampaignCalendarDoorOpenedMessageEvent, event =>
    {
        const parser = event.getParser();

        if(!parser) return;

        const lastAttempt = lastOpenAttempt;

        if(parser.doorOpened)
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
                copy.set(lastAttempt, new CalendarItem(parser.productName, parser.customImage,parser.furnitureClassName));
                    
                return copy;
            });
        }

        setLastOpenAttempt(-1);
    });

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived: (url: string) =>
            {
                const value = url.split('/');
        
                if(value.length < 2) return;
        
                switch(value[1])
                {
                    case 'calendar':
                        setCalendarOpen(true);
                        break;
                }
            },
            eventUrlPrefix: 'openView/'
        };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, []);

    return (
        <>
            { (calendarData && isCalendarOpen) && 
                <CalendarView onClose={ () => setCalendarOpen(false) } campaignName={ calendarData.campaignName } currentDay={ calendarData.currentDay } numDays={ calendarData.campaignDays } openedDays={ calendarData.openedDays } missedDays={ calendarData.missedDays } openPackage={ openPackage } receivedProducts={ receivedProducts } />
            }
        </>
    )
}
