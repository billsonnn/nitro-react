import { FC } from 'react';
import { WiredFurniType } from '../../../../api';
import { WiredActionBaseView } from './WiredActionBaseView';

export const WiredActionCallAnotherStackView: FC<{}> = props =>
{
    return <WiredActionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_BY_ID_BY_TYPE_OR_FROM_CONTEXT } hasSpecialInput={ false } save={ null } />;
}
