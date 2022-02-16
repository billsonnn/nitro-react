import { IAvatarFigureContainer, SaveWardrobeOutfitMessageComposer } from '@nitrots/nitro-renderer';
import { Dispatch, FC, SetStateAction, useCallback, useMemo } from 'react';
import { GetAvatarRenderManager, GetSessionDataManager } from '../../../../api';
import { AutoGrid, Base, Button, Flex, LayoutGridItem } from '../../../../common';
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
                    <LayoutGridItem key={ index } position="relative" overflow="hidden" className="nitro-avatar-editor-wardrobe-figure-preview">
                        { figureContainer &&
                            <AvatarImageView figure={ figureContainer.getFigureString() } gender={ gender } direction={ 2 } /> }
                        <Base className="avatar-shadow" />
                        { (clubLevel > 0) && <CurrencyIcon className="position-absolute top-1 start-1" type="hc" /> }
                        <Flex gap={ 1 } className="button-container">
                            <Button variant="link" fullWidth onClick={ event => saveFigureAtWardrobeIndex(index) }>Save</Button>
                            { figureContainer &&
                                <Button variant="link" fullWidth onClick={ event => wearFigureAtIndex(index) } disabled={ (clubLevel > GetSessionDataManager().clubLevel) }>Use</Button> }
                        </Flex>
                    </LayoutGridItem>
                );
            });

        return items;
    }, [ savedFigures, saveFigureAtWardrobeIndex, wearFigureAtIndex ]);

    return (
        <AutoGrid columnCount={ 5 } columnMinWidth={ 80 } columnMinHeight={ 140 }>
            { figures }
        </AutoGrid>
    );
}
