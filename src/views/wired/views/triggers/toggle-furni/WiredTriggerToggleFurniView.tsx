import { FC } from 'react';
import { WiredFurniType } from '../../../WiredView.types';
import { WiredTriggerBaseView } from '../base/WiredTriggerBaseView';

export const WiredTriggerToggleFurniView: FC<{}> = props =>
{
    return <WiredTriggerBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_BY_ID_OR_BY_TYPE } save={ null } />;
}
