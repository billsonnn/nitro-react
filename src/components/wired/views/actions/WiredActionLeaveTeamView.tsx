import { FC } from 'react';
import { WiredFurniType } from '../../common/WiredFurniType';
import { WiredActionBaseView } from './WiredActionBaseView';

export const WiredActionLeaveTeamView: FC<{}> = props =>
{
    return <WiredActionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } save={ null } />;
}
