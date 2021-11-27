export interface GuideToolMenuViewProps
{
    isOnDuty: boolean;
    isHandlingGuideRequests: boolean;
    setIsHandlingGuideRequests: (value: boolean) => void;
    isHandlingHelpRequests: boolean;
    setIsHandlingHelpRequests: (value: boolean) => void;
    isHandlingBullyReports: boolean;
    setIsHandlingBullyReports: (value: boolean) => void;
    guidesOnDuty: number;
    helpersOnDuty: number;
    guardiansOnDuty: number;
    processAction: (action: string) => void;
}
