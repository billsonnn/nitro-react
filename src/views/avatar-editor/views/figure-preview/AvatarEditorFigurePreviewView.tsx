import { FC, useCallback, useEffect, useState } from 'react';
import { AvatarImageView } from '../../../shared/avatar-image/AvatarImageView';
import { AvatarEditorFigurePreviewViewProps } from './AvatarEditorFigurePreviewView.types';

export const AvatarEditorFigurePreviewView: FC<AvatarEditorFigurePreviewViewProps> = props =>
{
    const { figureData = null } = props;
    const [ updateId, setUpdateId ] = useState(-1);

    const rerender = useCallback(() =>
    {
        setUpdateId(prevValue => (prevValue + 1));
    }, []);

    useEffect(() =>
    {
        if(!figureData) return;

        figureData.notify = rerender;

        return () =>
        {
            figureData.notify = null;
        }
    }, [ figureData, rerender ] );

    return <AvatarImageView figure={ figureData.getFigureString() } direction={ figureData.direction } scale={ 2 } />
}
