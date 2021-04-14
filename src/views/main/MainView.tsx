import { Nitro } from 'nitro-renderer/src/nitro/Nitro';
import { useEffect } from 'react';
import { HotelView } from '../hotel-view/HotelView';
import { ToolbarView } from '../toolbar/ToolbarView';
import './MainView.scss';
import { MainViewProps } from './MainView.types';

export function MainView(props: MainViewProps): JSX.Element
{
    useEffect(() =>
    {
        Nitro.instance.communication.connection.onReady();
    });

    return (
        <div>
            <HotelView />
            <ToolbarView />
        </div>
    );
}
