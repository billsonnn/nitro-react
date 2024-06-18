import { FC } from 'react';
import { WiredFurniType } from '../../../../api';
import { WiredTriggerBaseView } from './WiredTriggerBaseView';

export const WiredTriggerToggleFurniView: FC<{}> = props =>
{
    return <WiredTriggerBaseView hasSpecialInput={ false } requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_BY_ID_OR_BY_TYPE } save={ null } />;
};
