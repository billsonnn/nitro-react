import { FC } from 'react';
import { WiredFurniType } from '../../common/WiredFurniType';
import { WiredTriggerBaseView } from './WiredTriggerBaseView';

export const WiredTriggerGameEndsView: FC<{}> = props =>
{
    return <WiredTriggerBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } save={ null } />;
}
