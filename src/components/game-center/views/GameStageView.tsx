import { Game2ExitGameMessageComposer } from '@nitrots/nitro-renderer';
import { useEffect, useRef, useState } from 'react';
import { SendMessageComposer } from '../../../api';
import { Base } from '../../../common';
import { useGameCenter } from '../../../hooks';

export const GameStageView = () => 
{
    const { gameURL,setGameURL } = useGameCenter();
    const [ loadTimes, setLoadTimes ] = useState<number>(0);
    const ref = useRef<HTMLDivElement>();

    useEffect(()=>
    {
        if(!ref || ref && !ref.current) return;

        setLoadTimes(0);

        let frame: HTMLIFrameElement = document.createElement('iframe');

        frame.src = gameURL;
        frame.classList.add('game-center-stage');
        frame.classList.add('h-100');

        frame.onload = () => 
        {   
            setLoadTimes(prev => prev += 1)
        }

        ref.current.innerHTML = '';
        ref.current.appendChild(frame);

    },[ ref, gameURL ]);

    useEffect(()=>
    {
        if(loadTimes > 1) 
        {
            setGameURL(null);
            SendMessageComposer(new Game2ExitGameMessageComposer());
        }
    },[ loadTimes,setGameURL ])

    if(!gameURL) return null;

    return <Base innerRef={ ref }className="game-center-stage"/>
}
