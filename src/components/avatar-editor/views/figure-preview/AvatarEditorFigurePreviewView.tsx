import { AvatarDirectionAngle } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { Base } from '../../../../common/Base';
import { Column } from '../../../../common/Column';
import { AvatarImageView } from '../../../../views/shared/avatar-image/AvatarImageView';
import { FigureData } from '../../common/FigureData';
import { AvatarEditorIcon } from '../AvatarEditorIcon';

export interface AvatarEditorFigurePreviewViewProps
{
    figureData: FigureData;
}

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
        <Column className="figure-preview-container" overflow="hidden" position="relative">
            <AvatarImageView figure={ figureData.getFigureString() } direction={ figureData.direction } scale={ 2 } />
            <AvatarEditorIcon className="avatar-spotlight" icon="spotlight" />
            <Base className="avatar-shadow" />
            <Base className="arrow-container">
                <AvatarEditorIcon pointer icon="arrow-left" onClick={ event => rotateFigure(figureData.direction + 1) } />
                <AvatarEditorIcon pointer icon="arrow-right" onClick={ event => rotateFigure(figureData.direction - 1) } />
            </Base>
        </Column>
    );
}
