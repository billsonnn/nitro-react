import { FC } from 'react';
import { WiredFurniType } from '../../../../api';
import { WiredTriggerBaseView } from './WiredTriggerBaseView';

export const WiredTriggerGameStartsView: FC<{}> = props =>
{
    return <WiredTriggerBaseView hasSpecialInput={ false } requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } save={ null } />;
};
