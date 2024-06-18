import { AvatarFigurePartType } from '@nitrots/nitro-renderer';
import { useCallback, useMemo, useState } from 'react';

const useFigureDataState = () =>
{
    const [ selectedParts, setSelectedParts ] = useState<{ [index: string]: number }>({});
    const [ selectedColors, setSelectedColors ] = useState<{ [index: string]: number[] }>({});
    const [ gender, setGender ] = useState<string>(AvatarFigurePartType.MALE);

    const loadAvatarData = useCallback((figureString: string, gender: string) =>
    {
        const parse = (figure: string) =>
        {
            const sets = figure.split('.');

            if(!sets || !sets.length) return;

            const partSets: { [index: string]: number } = {};
            const colorSets: { [index: string]: number[] } = {};

            for(const set of sets)
            {
                const parts = set.split('-');

                if(!parts.length) continue;

                const setType = parts[0];
                const partId = parseInt(parts[1]);
                const colorIds: number[] = [];

                let offset = 2;

                while(offset < parts.length)
                {
                    colorIds.push(parseInt(parts[offset]));

                    offset++;
                }

                if(!colorIds.length) colorIds.push(0);

                if(partId >= 0) partSets[setType] = partId;

                if(colorIds.length) colorSets[setType] = colorIds;
            }

            return { partSets, colorSets };
        };

        const { partSets, colorSets } = parse(figureString);

        setSelectedParts(partSets);
        setSelectedColors(colorSets);
        setGender(gender);
    }, []);

    const selectPart = useCallback((setType: string, partId: number) =>
    {
        if(!setType || !setType.length) return;

        setSelectedParts(prevValue =>
        {
            const newValue = { ...prevValue };

            if(partId === -1) delete newValue[setType];
            else newValue[setType] = partId;

            return newValue;
        });
    }, []);

    const selectColor = useCallback((setType: string, paletteId: number, colorId: number) =>
    {
        if(!setType || !setType.length) return;

        setSelectedColors(prevValue =>
        {
            const newValue = { ...prevValue };

            if(!newValue[setType]) newValue[setType] = [];

            if(!newValue[setType][paletteId]) newValue[setType][paletteId] = 0;

            newValue[setType][paletteId] = colorId;

            return newValue;
        });
    }, []);

    const getFigureString = useMemo(() =>
    {
        let figureString = '';

        const partSets: string[] = [];
        const setTypes = Object.keys(selectedParts);

        for(const setType of setTypes)
        {
            const partId = selectedParts[setType];

            if(!partId) continue;

            let setPart = `${ setType }-${ partId }`;

            if(selectedColors[setType] && selectedColors[setType].length)
            {
                let i = 0;

                while(i < selectedColors[setType].length)
                {
                    setPart += `-${ selectedColors[setType][i] }`;

                    i++;
                }
            }

            partSets.push(setPart);
        }

        for(const partSet of partSets)
        {
            figureString += partSet;

            if(partSets.indexOf(partSet) < (partSets.length - 1)) figureString += '.';
        }

        return figureString;
    }, [ selectedParts, selectedColors ]);

    const getFigureStringWithFace = useCallback((overridePartId: number, override: boolean = true) =>
    {
        const figureSets = [ AvatarFigurePartType.HEAD ].map(setType =>
        {
            let partId = (setType === AvatarFigurePartType.HEAD && override) ? overridePartId : selectedParts[setType];
            const colors = selectedColors[setType] || [];

            let figureSet = `${ setType }-${ partId }`;

            if(partId >= 0) figureSet += colors.map(color => `-${ color }`).join('');

            return figureSet;
        });

        return figureSets.join('.');
    }, [ selectedParts, selectedColors ]);

    return { selectedParts, selectedColors, gender, setGender, loadAvatarData, selectPart, selectColor, getFigureString, getFigureStringWithFace };
};

export const useFigureData = useFigureDataState;
