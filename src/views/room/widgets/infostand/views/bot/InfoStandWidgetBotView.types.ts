import { UserInfoData } from '../../../../../../api';

export interface InfoStandWidgetBotViewProps
{
    botInfoData: UserInfoData;
    close: () => void;
}
