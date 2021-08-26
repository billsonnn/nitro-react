import { DetailsHTMLAttributes } from 'react';

export interface NotificationBubbleViewProps extends DetailsHTMLAttributes<HTMLDivElement>
{
    fadesOut?: boolean;
    close: () => void;
}
