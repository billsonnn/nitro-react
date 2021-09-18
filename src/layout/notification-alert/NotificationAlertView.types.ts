import { DetailsHTMLAttributes } from 'react';

export interface NotificationAlertViewProps extends DetailsHTMLAttributes<HTMLDivElement>
{
    title: string;
    close: () => void;
}
