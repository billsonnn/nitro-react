export interface CalendarItemViewProps
{
    id: number;
    productName?: string;
    state: number;
    active?: boolean;
    onClick(itemId: number): void;
}
