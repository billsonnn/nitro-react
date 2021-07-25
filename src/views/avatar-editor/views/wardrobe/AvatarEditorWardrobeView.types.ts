import { Dispatch, SetStateAction } from 'react';
import { FigureData } from '../../common/FigureData';

export interface AvatarEditorWardrobeViewProps
{
    figureData: FigureData;
    savedFigures: [ string, string ][];
    setSavedFigures: Dispatch<SetStateAction<[ string, string][]>>;
    loadAvatarInEditor: (figure: string, gender: string, reset?: boolean) => void;
}
