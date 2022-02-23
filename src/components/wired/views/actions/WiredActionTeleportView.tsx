import { FC } from 'react';
import { WiredFurniType } from '../../common/WiredFurniType';
import { WiredActionBaseView } from './WiredActionBaseView';

export const WiredActionTeleportView: FC<{}> = props =>
{
    return <WiredActionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_BY_ID_BY_TYPE_OR_FROM_CONTEXT } save={ null } />;
}
