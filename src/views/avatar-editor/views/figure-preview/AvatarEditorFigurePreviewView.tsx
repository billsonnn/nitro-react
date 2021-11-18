import { AvatarDirectionAngle } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { NitroLayoutFlexColumn } from '../../../../layout';
import { NitroLayoutBase } from '../../../../layout/base';
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

    const rotateFigure = useCallback((direction: number) =>
    {
        if(direction < AvatarDirectionAngle.MIN_DIRECTION)
        {
            direction = (AvatarDirectionAngle.MAX_DIRECTION + (direction + 1));
        }

        if(direction > AvatarDirectionAngle.MAX_DIRECTION)
        {
            direction = (direction - (AvatarDirectionAngle.MAX_DIRECTION + 1));
        }

        figureData.direction = direction;
    }, [ figureData ]);

    useEffect(() =>
    {
        if(!figureData) return;

        figureData.notify = rerender;

        return () =>
        {
            figureData.notify = null;
        }
    }, [ figureData, rerender ] );

    return (
        <NitroLayoutFlexColumn className="figure-preview-container" overflow="hidden" position="relative">
            <AvatarImageView figure={ figureData.getFigureString() } direction={ figureData.direction } scale={ 2 } />
            <NitroLayoutBase className="nitro-avatar-editor-spritesheet spotlight" />
            <NitroLayoutBase className="avatar-shadow" />
            <NitroLayoutBase className="arrow-container">
                <div className="nitro-avatar-editor-spritesheet arrow-left-icon" onClick={ event => rotateFigure(figureData.direction + 1) }  />
                <div className="nitro-avatar-editor-spritesheet arrow-right-icon" onClick={ event => rotateFigure(figureData.direction - 1) } />
            </NitroLayoutBase>
        </NitroLayoutFlexColumn>
    );
}
