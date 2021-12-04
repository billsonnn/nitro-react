import { GuideToolMessageGroup } from '../../common';

export interface GuideToolOngoingViewProps
{
    isGuide: boolean;
    userId: number;
    userName: string;
    userFigure: string;
    isTyping: boolean;
    messageGroups: GuideToolMessageGroup[];
}
