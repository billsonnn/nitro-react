import { GetAvatarRenderManager, IAvatarFigureContainer, SaveWardrobeOutfitMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback } from 'react';
import { GetClubMemberLevel, GetConfigurationValue, LocalizeText, SendMessageComposer } from '../../api';
import { Button, LayoutAvatarImageView, LayoutCurrencyIcon } from '../../common';
import { useAvatarEditor } from '../../hooks';
import { InfiniteGrid } from '../../layout';

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
        <InfiniteGrid columnCount={ 5 } estimateSize={ 140 } itemRender={ (item: [ IAvatarFigureContainer, string ], index: number) =>
        {
            const [ figureContainer, gender ] = item;

            let clubLevel = 0;

            if(figureContainer) clubLevel = GetAvatarRenderManager().getFigureClubLevel(figureContainer, gender);

            return (
                <InfiniteGrid.Item className="nitro-avatar-editor-wardrobe-figure-preview">
                    { figureContainer &&
                    <LayoutAvatarImageView direction={ 2 } figure={ figureContainer.getFigureString() } gender={ gender } /> }
                    <div className="avatar-shadow" />
                    { !hcDisabled && (clubLevel > 0) && <LayoutCurrencyIcon className="absolute top-1 start-1" type="hc" /> }
                    <div className="flex gap-1 button-container">
                        <Button fullWidth variant="link" onClick={ event => saveFigureAtWardrobeIndex(index) }>{ LocalizeText('avatareditor.wardrobe.save') }</Button>
                        { figureContainer &&
                        <Button fullWidth disabled={ (clubLevel > GetClubMemberLevel()) } variant="link" onClick={ event => wearFigureAtIndex(index) }>{ LocalizeText('widget.generic_usable.button.use') }</Button> }
                    </div>
                </InfiniteGrid.Item>
            );
        } } items={ savedFigures } overscan={ 5 } />
    );
};
