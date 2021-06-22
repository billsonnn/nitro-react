import { FC } from 'react';
import { NitroCardContentView, NitroCardView } from '../../../../layout';
import { NitroCardSimpleHeaderView } from '../../../../layout/card/simple-header';
import { ModToolsTicketsViewProps } from './ModToolsTicketsView.types';

export const ModToolsTicketsView: FC<ModToolsTicketsViewProps> = props =>
{
    return (
        <NitroCardView className="nitro-mod-tools-tickets">
            <NitroCardSimpleHeaderView headerText={ "Tickets" } onCloseClick={ event => {} } />
            <NitroCardContentView className="text-black">
               
            </NitroCardContentView>
        </NitroCardView>
    );
}
