export interface CalendarViewProps
{
    close(): void;
    campaignName: string;
    currentDay: number;
    numDays: number;
    openedDays: number[];
    missedDays: number[];
}
