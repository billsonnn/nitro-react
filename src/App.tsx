import { Nitro, NitroLogger, NitroVersion } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { GetNitroInstance, GetUIVersion } from './api';
import { Base } from './common';
import { LoadingView } from './components/loading/LoadingView';
import { MainView } from './components/main/MainView';

NitroVersion.UI_VERSION = GetUIVersion();

export const App: FC<{}> = props =>
{
    const [ isReady, setIsReady ] = useState(false);
    const [ isError, setIsError ] = useState(false);
    const [ message, setMessage ] = useState('Getting Ready');
    const [ percent, setPercent ] = useState(0);
    const [ imageRendering, setImageRendering ] = useState<boolean>(true);

    useEffect(() =>
    {
        (async () =>
        {
            try
            {
                //@ts-ignore
                if(!NitroConfig) throw new Error('NitroConfig is not defined!');

                Nitro.bootstrap();
                await GetNitroInstance().init();

                setIsReady(true);

                // handle socket close
                //canvas.addEventListener('webglcontextlost', () => instance.events.dispatchEvent(new NitroEvent(Nitro.WEBGL_CONTEXT_LOST)));
            }

            catch(err)
            {
                NitroLogger.error(err);
            }
        })();
    
        const resize = (event: UIEvent) => setImageRendering(!(window.devicePixelRatio % 1));

        window.addEventListener('resize', resize);

        resize(null);

        return () =>
        {
            window.removeEventListener('resize', resize);
        }
    }, []);
    
    return (
        <Base fit overflow="hidden" className={ imageRendering && 'image-rendering-pixelated' }>
            { (!isReady || isError) &&
                <LoadingView isError={ false } message={ message } percent={ 0 } showPercent={ false } /> }
            { isReady && <MainView /> }
            <Base id="draggable-windows-container" />
        </Base>
    );
}
