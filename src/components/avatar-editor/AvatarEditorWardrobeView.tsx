import { GetAvatarRenderManager, IAvatarFigureContainer, SaveWardrobeOutfitMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback } from 'react';
import { GetClubMemberLevel, GetConfigurationValue, LocalizeText, SendMessageComposer } from '../../api';
import { Base, Button, Flex, InfiniteGrid, LayoutAvatarImageView, LayoutCurrencyIcon, LayoutGridItem } from '../../common';
import { useAvatarEditor } from '../../hooks';

export const AvatarEditorWardrobeView: FC<{}> = props =>
{
    const { savedFigures = [], setSavedFigures = null, loadAvatarData = null, getFigureString = null, gender = null } = useAvatarEditor();

    const hcDisabled = GetConfigurationValue<boolean>('hc.disabled', false);

    const wearFigureAtIndex = useCallback((index: number) =>
    {
        if((index >= savedFigures.length) || (index < 0)) return;

        const [ figure, gender ] = savedFigures[index];

        loadAvatarData(figure.getFigureString(), gender);
    }, [ savedFigures, loadAvatarData ]);

    const saveFigureAtWardrobeIndex = useCallback((index: number) =>
    {
        if((index >= savedFigures.length) || (index < 0)) return;

        const newFigures = [ ...savedFigures ];

        const figure = getFigureString;

        newFigures[index] = [ GetAvatarRenderManager().createFigureContainer(figure), gender ];

        setSavedFigures(newFigures);
        SendMessageComposer(new SaveWardrobeOutfitMessageComposer((index + 1), figure, gender));
    }, [ getFigureString, gender, savedFigures, setSavedFigures ]);

    return (
        <InfiniteGrid rows={ savedFigures } columnCount={ 5 } overscan={ 5 } estimateSize={ 140 } itemRender={ (item: [ IAvatarFigureContainer, string ], index: number) =>
        {
            const [ figureContainer, gender ] = item;
            
            let clubLevel = 0;

            if(figureContainer) clubLevel = GetAvatarRenderManager().getFigureClubLevel(figureContainer, gender);

            return (
                <LayoutGridItem position="relative" overflow="hidden" className="nitro-avatar-editor-wardrobe-figure-preview">
                    { figureContainer &&
                    <LayoutAvatarImageView figure={ figureContainer.getFigureString() } gender={ gender } direction={ 2 } /> }
                    <Base className="avatar-shadow" />
                    { !hcDisabled && (clubLevel > 0) && <LayoutCurrencyIcon className="position-absolute top-1 start-1" type="hc" /> }
                    <Flex gap={ 1 } className="button-container">
                        <Button variant="link" fullWidth onClick={ event => saveFigureAtWardrobeIndex(index) }>{ LocalizeText('avatareditor.wardrobe.save') }</Button>
                        { figureContainer &&
                        <Button variant="link" fullWidth onClick={ event => wearFigureAtIndex(index) } disabled={ (clubLevel > GetClubMemberLevel()) }>{ LocalizeText('widget.generic_usable.button.use') }</Button> }
                    </Flex>
                </LayoutGridItem>
            )
        } } />
    );
}
