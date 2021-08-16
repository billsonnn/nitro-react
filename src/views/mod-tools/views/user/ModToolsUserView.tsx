import { FC } from 'react';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../layout';
import { ModToolsUserViewProps } from './ModToolsUserView.types';

export const ModToolsUserView: FC<ModToolsUserViewProps> = props =>
{
    return (
        <NitroCardView className="nitro-mod-tools-user" simple={ true }>
            <NitroCardHeaderView headerText={ 'User Info' } onCloseClick={ event => {} } />
            <NitroCardContentView className="text-black">
               
            </NitroCardContentView>
        </NitroCardView>
    );
}
