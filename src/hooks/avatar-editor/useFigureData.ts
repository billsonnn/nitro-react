import { useCallback, useState } from 'react';
import { FigureData } from '../../api';

const useFigureDataState = () =>
{
    const [ selectedParts, setSelectedParts ] = useState<{ [index: string]: number }>({});
    const [ selectedColors, setSelectedColors ] = useState<{ [index: string]: number[] }>({});
    const [ gender, setGender ] = useState<string>(FigureData.MALE);

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
        }

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

            newValue[setType] = partId;

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
        })
    }, []);

    const getFigureStringWithFace = useCallback((overridePartId: number, override: boolean = true) => 
    {
        const figureSets = [ FigureData.FACE ].map(setType => 
        {
            // Determine the part ID, with an option to override if the set type matches.
            let partId = (setType === FigureData.FACE && override) ? overridePartId : selectedParts[setType];
            const colors = selectedColors[setType] || [];
    
            // Construct the figure set string, including the type, part ID, and any colors.
            let figureSet = `${ setType }-${ partId }`;
            if (partId >= 0) 
            {
                figureSet += colors.map(color => `-${ color }`).join('');
            }
    
            return figureSet;
        });
    
        // Join all figure sets with '.', ensuring to only add '.' between items, not at the end.
        return figureSets.join('.');
    }, [ selectedParts, selectedColors ]);

    return { selectedParts, selectedColors, gender, loadAvatarData, selectPart, selectColor, getFigureStringWithFace };
}

export const useFigureData = useFigureDataState;
