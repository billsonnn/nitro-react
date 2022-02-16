import { IAvatarFigureContainer, SaveWardrobeOutfitMessageComposer } from '@nitrots/nitro-renderer';
import { Dispatch, FC, SetStateAction, useCallback, useMemo } from 'react';
import { Button } from 'react-bootstrap';
import { GetAvatarRenderManager, GetSessionDataManager } from '../../../../api';
import { AutoGrid } from '../../../../common/AutoGrid';
import { LayoutGridItem } from '../../../../common/layout/LayoutGridItem';
import { SendMessageHook } from '../../../../hooks';
import { AvatarImageView } from '../../../../views/shared/avatar-image/AvatarImageView';
import { CurrencyIcon } from '../../../../views/shared/currency-icon/CurrencyIcon';
import { FigureData } from '../../common/FigureData';

export interface AvatarEditorWardrobeViewProps
{
    figureData: FigureData;
    savedFigures: [ IAvatarFigureContainer, string ][];
    setSavedFigures: Dispatch<SetStateAction<[ IAvatarFigureContainer, string][]>>;
    loadAvatarInEditor: (figure: string, gender: string, reset?: boolean) => void;
}

export const AvatarEditorWardrobeView: FC<AvatarEditorWardrobeViewProps> = props =>
{
    const { figureData = null, savedFigures = [], setSavedFigures = null, loadAvatarInEditor = null } = props;

    const wearFigureAtIndex = useCallback((index: number) =>
    {
        if((index >= savedFigures.length) || (index < 0)) return;

        const [ figure, gender ] = savedFigures[index];

        loadAvatarInEditor(figure.getFigureString(), gender);
    }, [ savedFigures, loadAvatarInEditor ]);

    const saveFigureAtWardrobeIndex = useCallback((index: number) =>
    {
        if(!figureData || (index >= savedFigures.length) || (index < 0)) return;

        const newFigures = [ ...savedFigures ];

        const figure = figureData.getFigureString();
        const gender = figureData.gender;

        newFigures[index] = [ GetAvatarRenderManager().createFigureContainer(figure), gender ];

        setSavedFigures(newFigures);
        SendMessageHook(new SaveWardrobeOutfitMessageComposer((index + 1), figure, gender));
    }, [ figureData, savedFigures, setSavedFigures ]);

    const figures = useMemo(() =>
    {
        if(!savedFigures || !savedFigures.length) return [];

        const items: JSX.Element[] = [];

        savedFigures.forEach(([ figureContainer, gender ], index) =>
            {
                let clubLevel = 0;

                if(figureContainer) clubLevel = GetAvatarRenderManager().getFigureClubLevel(figureContainer, gender);

                items.push(
                    <LayoutGridItem key={ index } position="relative" justifyContent="end" alignItems="center">
                        { figureContainer &&
                            <AvatarImageView figure={ figureContainer.getFigureString() } gender={ gender } direction={ 2 } position="absolute" className="bottom-3" /> }
                        { (clubLevel > 0) && <CurrencyIcon className="position-absolute top-1 start-1" type="hc" /> }
                        <div className="d-flex w-100 figure-button-container p-1">
                            <Button variant="link" size="sm" className="w-100" onClick={ event => saveFigureAtWardrobeIndex(index) }>Save</Button>
                            { figureContainer && <Button variant="link" size="sm" className="w-100" onClick={ event => wearFigureAtIndex(index) } disabled={ (clubLevel > GetSessionDataManager().clubLevel) }>Use</Button> }
                        </div>
                    </LayoutGridItem>
                );
            });

        return items;
    }, [ savedFigures, saveFigureAtWardrobeIndex, wearFigureAtIndex ]);

    return (
        <AutoGrid grow columnCount={ 5 } overflow="auto" columnMinWidth={ 80 } columnMinHeight={ 140 }>
            { figures }
        </AutoGrid>
    );
}
