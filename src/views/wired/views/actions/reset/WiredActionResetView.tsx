import { FC } from 'react';
import { WiredFurniType } from '../../../WiredView.types';
import { WiredActionBaseView } from '../base/WiredActionBaseView';

export const WiredActionResetView: FC<{}> = props =>
{
    return <WiredActionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } save={ null } />;
}
