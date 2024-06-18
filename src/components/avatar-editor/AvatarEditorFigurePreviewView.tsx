import { AvatarDirectionAngle } from '@nitrots/nitro-renderer';
import { FC, useState } from 'react';
import { LayoutAvatarImageView } from '../../common';
import { useAvatarEditor } from '../../hooks';
import { AvatarEditorIcon } from './AvatarEditorIcon';

const DEFAULT_DIRECTION: number = 4;

export const AvatarEditorFigurePreviewView: FC<{}> = props =>
{
    const [ direction, setDirection ] = useState<number>(DEFAULT_DIRECTION);
    const { getFigureString = null } = useAvatarEditor();

    const rotateFigure = (newDirection: number) =>
    {
        if(direction < AvatarDirectionAngle.MIN_DIRECTION)
        {
            newDirection = (AvatarDirectionAngle.MAX_DIRECTION + (direction + 1));
        }

        if(direction > AvatarDirectionAngle.MAX_DIRECTION)
        {
            newDirection = (direction - (AvatarDirectionAngle.MAX_DIRECTION + 1));
        }

        setDirection(newDirection);
    };

    return (
        <div className="flex flex-col figure-preview-container overflow-hidden relative">
            <LayoutAvatarImageView direction={ direction } figure={ getFigureString } scale={ 2 } />
            <AvatarEditorIcon className="avatar-spotlight" icon="spotlight" />
            <div className="avatar-shadow" />
            <div className="arrow-container">
                <AvatarEditorIcon icon="arrow-left" onClick={ event => rotateFigure(direction + 1) } />
                <AvatarEditorIcon icon="arrow-right" onClick={ event => rotateFigure(direction - 1) } />
            </div>
        </div>
    );
};
