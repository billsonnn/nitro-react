import { RentableBotInfoData } from '../../../../../../api';

export interface InfoStandWidgetRentableBotViewProps
{
    rentableBotInfoData: RentableBotInfoData;
    close: () => void;
}
