import { AvatarDirectionAngle } from '@nitrots/nitro-renderer';
import { FC, useState } from 'react';
import { Base, Column, LayoutAvatarImageView } from '../../common';
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
    }

    return (
        <Column className="figure-preview-container" overflow="hidden" position="relative">
            <LayoutAvatarImageView figure={ getFigureString } direction={ direction } scale={ 2 } />
            <AvatarEditorIcon className="avatar-spotlight" icon="spotlight" />
            <Base className="avatar-shadow" />
            <Base className="arrow-container">
                <AvatarEditorIcon pointer icon="arrow-left" onClick={ event => rotateFigure(direction + 1) } />
                <AvatarEditorIcon pointer icon="arrow-right" onClick={ event => rotateFigure(direction - 1) } />
            </Base>
        </Column>
    );
}
