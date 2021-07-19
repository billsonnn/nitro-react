import { FC, useCallback, useEffect, useState } from 'react';
import { AvatarImageView } from '../../../shared/avatar-image/AvatarImageView';
import { AvatarEditorFigurePreviewViewProps } from './AvatarEditorFigurePreviewView.types';

export const AvatarEditorFigurePreviewView: FC<AvatarEditorFigurePreviewViewProps> = props =>
{
    const { editor = null } = props;
    const [ updateId, setUpdateId ] = useState(-1);

    const rerender = useCallback(() =>
    {
        setUpdateId(prevValue => (prevValue + 1));
    }, []);

    useEffect(() =>
    {
        if(!editor) return;

        editor.notify = rerender;

        return () =>
        {
            editor.notify = null;
        }
    }, [ editor, rerender ] );

    return <AvatarImageView figure={ editor.figureData.getFigureString() } direction={ 4 } scale={ 2 } />
}
