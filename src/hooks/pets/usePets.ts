import { useState } from 'react';
import { useBetween } from 'use-between';

const usePetsState = () =>
{
    const [ petRespect, setPetRespect ] = useState(0);

    const changePetRespect = (respects: React.SetStateAction<number>) =>
    {
        setPetRespect(respects);
    }

    return { petRespect, setPetRespect, changePetRespect };
}

export const usePets = () => useBetween(usePetsState);
