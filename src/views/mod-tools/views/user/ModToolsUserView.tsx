import { FC } from 'react';
import { NitroCardContentView, NitroCardView } from '../../../../layout';
import { NitroCardSimpleHeaderView } from '../../../../layout/card/simple-header';
import { ModToolsUserViewProps } from './ModToolsUserView.types';

export const ModToolsUserView: FC<ModToolsUserViewProps> = props =>
{
    return (
        <NitroCardView className="nitro-mod-tools-user">
            <NitroCardSimpleHeaderView headerText={ "User Info" } onCloseClick={ event => {} } />
            <NitroCardContentView className="text-black">
               
            </NitroCardContentView>
        </NitroCardView>
    );
}
