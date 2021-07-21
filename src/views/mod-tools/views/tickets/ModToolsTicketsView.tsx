import { FC } from 'react';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../layout';
import { ModToolsTicketsViewProps } from './ModToolsTicketsView.types';

export const ModToolsTicketsView: FC<ModToolsTicketsViewProps> = props =>
{
    return (
        <NitroCardView className="nitro-mod-tools-tickets" simple={ true }>
            <NitroCardHeaderView headerText={ "Tickets" } onCloseClick={ event => {} } />
            <NitroCardContentView className="text-black">
               
            </NitroCardContentView>
        </NitroCardView>
    );
}
