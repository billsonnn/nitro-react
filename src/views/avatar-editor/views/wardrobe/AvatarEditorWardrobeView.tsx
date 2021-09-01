import { SaveWardrobeOutfitMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useMemo } from 'react';
import { Button } from 'react-bootstrap';
import { GetAvatarRenderManager } from '../../../../api';
import { SendMessageHook } from '../../../../hooks';
import { NitroCardGridItemView } from '../../../../layout/card/grid/item/NitroCardGridItemView';
import { NitroCardGridView } from '../../../../layout/card/grid/NitroCardGridView';
import { NitroCardGridThemes } from '../../../../layout/card/grid/NitroCardGridView.types';
import { AvatarImageView } from '../../../shared/avatar-image/AvatarImageView';
import { CurrencyIcon } from '../../../shared/currency-icon/CurrencyIcon';
import { AvatarEditorWardrobeViewProps } from './AvatarEditorWardrobeView.types';

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
        if(!savedFigures) return [];

        const items: JSX.Element[] = [];

        savedFigures.forEach(([ figureContainer, gender ], index) =>
            {
                const clubLevel = GetAvatarRenderManager().getFigureClubLevel(figureContainer, gender);

                items.push(
                    <NitroCardGridItemView key={ index } className="flex-column justify-content-end">
                        { figureContainer && <AvatarImageView figure={ figureContainer.getFigureString() } gender={ gender } direction={ 2 } /> }
                        { clubLevel > 0 && <CurrencyIcon type="hc" /> }
                        <div className="d-flex w-100 figure-button-container p-1">
                            <Button variant="link" size="sm" className="w-100" onClick={ event => saveFigureAtWardrobeIndex(index) }>Save</Button>
                            { figureContainer && <Button variant="link" size="sm" className="w-100" onClick={ event => wearFigureAtIndex(index) }>Use</Button> }
                        </div>
                    </NitroCardGridItemView>
                );
            });

        return items;
    }, [ savedFigures, saveFigureAtWardrobeIndex, wearFigureAtIndex ]);

    return (
        <div className="row h-100">
            <div className="col-12 d-flex h-100">
                <NitroCardGridView className="wardrobe-grid" columns={ 5 } theme={ NitroCardGridThemes.THEME_DEFAULT }>
                    { figures }
                </NitroCardGridView>
            </div>
        </div>
    );
}
