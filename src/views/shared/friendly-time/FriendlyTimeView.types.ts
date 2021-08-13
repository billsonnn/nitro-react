import { DetailsHTMLAttributes } from 'react';

export interface FriendlyTimeViewProps extends DetailsHTMLAttributes<HTMLDivElement>
{
    seconds: number;
    isShort?: boolean;
}
