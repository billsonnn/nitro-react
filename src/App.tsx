import { ConfigurationEvent, NitroEvent } from 'nitro-renderer';
import { NitroCommunicationDemoEvent } from 'nitro-renderer/src/nitro/communication/demo/NitroCommunicationDemoEvent';
import { LegacyExternalInterface } from 'nitro-renderer/src/nitro/externalInterface/LegacyExternalInterface';
import { NitroLocalizationEvent } from 'nitro-renderer/src/nitro/localization/NitroLocalizationEvent';
import { Nitro } from 'nitro-renderer/src/nitro/Nitro';
import { RoomEngineEvent } from 'nitro-renderer/src/nitro/room/events/RoomEngineEvent';
import { WebGL } from 'nitro-renderer/src/nitro/utils/WebGL';
import { useState } from 'react';
import { useConfigurationEvent } from './hooks/events/core/configuration/configuration-event';
import { useLocalizationEvent } from './hooks/events/nitro/localization/localization-event';
import { dispatchMainEvent, useMainEvent } from './hooks/events/nitro/main-event';
import { useRoomEngineEvent } from './hooks/events/nitro/room/room-engine-event';
import { LoadingView } from './views/loading/LoadingView';
import { MainView } from './views/main/MainView';

export function App(): JSX.Element
{
    const [ isReady, setIsReady ]   = useState(false);
    const [ isError, setIsError ]   = useState(false);
    const [ message, setMessage ]   = useState('Getting Ready');

    //@ts-ignore
    if(!NitroConfig) throw new Error('NitroConfig is not defined!');

    if(!Nitro.instance) Nitro.bootstrap();

    function getPreloadAssetUrls(): string[]
    {
        const urls: string[] = [];

        const assetUrls = Nitro.instance.getConfiguration<string[]>('preload.assets.urls');

        if(assetUrls && assetUrls.length)
        {
            for(const url of assetUrls)
            {
                urls.push(Nitro.instance.core.configuration.interpolate(url));
            }
        }

        return urls;
    }

    const handler = (event: NitroEvent) =>
    {
        switch(event.type)
        {
            case ConfigurationEvent.LOADED:
                Nitro.instance.localization.init();
                return;
            case ConfigurationEvent.FAILED:
                setIsError(true);
                setMessage('Configuration Failed');
                return;
            case Nitro.WEBGL_UNAVAILABLE:
                setIsError(true);
                setMessage('WebGL Required');
                return;
            case Nitro.WEBGL_CONTEXT_LOST:
                setIsError(true);
                setMessage('WebGL Context Lost - Reloading');

                setTimeout(() => window.location.reload(), 1500);
                return;
			case NitroCommunicationDemoEvent.CONNECTION_HANDSHAKING:
				return;
			case NitroCommunicationDemoEvent.CONNECTION_HANDSHAKE_FAILED:
                setIsError(true);
                setMessage('Handshake Failed');
				return;
			case NitroCommunicationDemoEvent.CONNECTION_AUTHENTICATED:
                setMessage('Finishing Up');

                Nitro.instance.init();
				return;
			case NitroCommunicationDemoEvent.CONNECTION_ERROR:
                setIsError(true);
                setMessage('Connection Error');
				return;
			case NitroCommunicationDemoEvent.CONNECTION_CLOSED:
                if(Nitro.instance.roomEngine) Nitro.instance.roomEngine.dispose();

                setIsError(true);
                setMessage('Connection Error');

                LegacyExternalInterface.call('disconnect', -1, 'client.init.handshake.fail');
                return;
            case RoomEngineEvent.ENGINE_INITIALIZED:
                setIsReady(true);
                return;
            case NitroLocalizationEvent.LOADED:
                Nitro.instance.core.asset.downloadAssets(getPreloadAssetUrls(), (status: boolean) =>
                {
                    if(status)
                    {
                        setMessage('Connecting');
                        
                        Nitro.instance.communication.init();
                    }
                    else
                    {
                        setIsError(true);
                        setMessage('Assets Failed');
                    }
                });
                return;
        }
    };

    useMainEvent(Nitro.WEBGL_UNAVAILABLE, handler);
    useMainEvent(Nitro.WEBGL_CONTEXT_LOST, handler);
    useMainEvent(NitroCommunicationDemoEvent.CONNECTION_HANDSHAKING, handler);
    useMainEvent(NitroCommunicationDemoEvent.CONNECTION_HANDSHAKE_FAILED, handler);
    useMainEvent(NitroCommunicationDemoEvent.CONNECTION_AUTHENTICATED, handler);
    useMainEvent(NitroCommunicationDemoEvent.CONNECTION_ERROR, handler);
    useMainEvent(NitroCommunicationDemoEvent.CONNECTION_CLOSED, handler);
    useRoomEngineEvent(RoomEngineEvent.ENGINE_INITIALIZED, handler);
    useLocalizationEvent(NitroLocalizationEvent.LOADED, handler);
    useConfigurationEvent(ConfigurationEvent.LOADED, handler);
    useConfigurationEvent(ConfigurationEvent.FAILED, handler);

    if(!WebGL.isWebGLAvailable())
    {
        dispatchMainEvent(new NitroEvent(Nitro.WEBGL_UNAVAILABLE));

        return;
    }

    Nitro.instance.core.configuration.init();
    
    return (
        <div>
            { (!isReady || isError) && <LoadingView isError={ isError } message={ message } /> }
            { (isReady && !isError) && <MainView /> }
        </div>
    );
}
