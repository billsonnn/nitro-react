import { IAvatarFigureContainer } from '@nitrots/nitro-renderer';
import { Dispatch, SetStateAction } from 'react';
import { FigureData } from '../../common/FigureData';

export interface AvatarEditorWardrobeViewProps
{
    figureData: FigureData;
    savedFigures: [ IAvatarFigureContainer, string ][];
    setSavedFigures: Dispatch<SetStateAction<[ IAvatarFigureContainer, string][]>>;
    loadAvatarInEditor: (figure: string, gender: string, reset?: boolean) => void;
}
