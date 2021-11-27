export interface CalendarViewProps
{
    close(): void;
    openPackage(id: number, asStaff: boolean): void;
    receivedProducts: Map<number, string>;
    campaignName: string;
    currentDay: number;
    numDays: number;
    openedDays: number[];
    missedDays: number[];
}
