import { FC, useCallback, useState } from 'react';
import { LocalizeText } from '../../../../api';
import { NitroCardContentView, NitroCardGridItemView, NitroCardGridView, NitroCardHeaderView, NitroCardView } from '../../../../layout';
import { CalendarViewProps } from './CalendarView.types';

export const CalendarView: FC<CalendarViewProps> = props =>
{
    const { close = null, campaignName = null, currentDay = null, numDays = null, missedDays = null, openedDays = null } = props;
    const [ selectedDay, setSelectedDay ] = useState(currentDay);

    const dayMessage = useCallback((day: number) =>
    {
        if(missedDays.includes(day))
        {
            return LocalizeText('campaign.calendar.info.expired');
        }

        if(openedDays.includes(day))
        {
            return LocalizeText('campaign.calendar.info.unlocked')
        }
    }, [missedDays, openedDays]);

    return (
        <NitroCardView className="nitro-campaign-calendar">
            <NitroCardHeaderView headerText={LocalizeText(`campaign.calendar.${campaignName}.title`)} onCloseClick={close}/>
            <NitroCardContentView>
                <div className="text-black">
                    <h3>{LocalizeText('campaign.calendar.heading.day', ['number'], [selectedDay.toString()])}</h3>
                    <p>{LocalizeText('')}</p>
                </div>
                <NitroCardGridView className="h-100 w-100" columns={7}>
                    { 
                        [...Array(7)].map((e, i) =>
                        {
                            return <NitroCardGridItemView key={i} className="calendar-day h-100"/>
                        })
                    }
                </NitroCardGridView>
            </NitroCardContentView>
        </NitroCardView>
    )
}
