import { NitroLayoutBaseProps } from '../base';

export interface NotificationBubbleViewProps extends NitroLayoutBaseProps
{
    fadesOut?: boolean;
    timeoutMs?: number;
    close: () => void;
}
