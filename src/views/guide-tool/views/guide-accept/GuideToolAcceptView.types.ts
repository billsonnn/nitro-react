export interface GuideToolAcceptViewProps
{
    helpRequestDescription: string;
    helpRequestCountdown: number;
    processAction: (action: string) => void;
}
