import { IRoomCameraWidgetEffect, IRoomCameraWidgetSelectedEffect, RoomCameraWidgetSelectedEffect } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { FaSave, FaSearchMinus, FaSearchPlus, FaTrash } from 'react-icons/fa';
import ReactSlider from 'react-slider';
import { CameraEditorTabs, CameraPicture, CameraPictureThumbnail, GetRoomCameraWidgetManager, LocalizeText } from '../../../../api';
import { Button, ButtonGroup, Column, Flex, Grid, LayoutImage, NitroCardContentView, NitroCardHeaderView, NitroCardTabsItemView, NitroCardTabsView, NitroCardView, Text } from '../../../../common';
import { CameraWidgetEffectListView } from './effect-list/CameraWidgetEffectListView';

export interface CameraWidgetEditorViewProps
{
    picture: CameraPicture;
    availableEffects: IRoomCameraWidgetEffect[];
    myLevel: number;
    onClose: () => void;
    onCancel: () => void;
    onCheckout: (pictureUrl: string) => void;
}

const TABS: string[] = [ CameraEditorTabs.COLORMATRIX, CameraEditorTabs.COMPOSITE ];

export const CameraWidgetEditorView: FC<CameraWidgetEditorViewProps> = props =>
{
    const { picture = null, availableEffects = null, myLevel = 1, onClose = null, onCancel = null, onCheckout = null } = props;
    const [ currentTab, setCurrentTab ] = useState(TABS[0]);
    const [ selectedEffectName, setSelectedEffectName ] = useState<string>(null);
    const [ selectedEffects, setSelectedEffects ] = useState<IRoomCameraWidgetSelectedEffect[]>([]);
    const [ effectsThumbnails, setEffectsThumbnails ] = useState<CameraPictureThumbnail[]>([]);
    const [ isZoomed, setIsZoomed ] = useState(false);

    const getColorMatrixEffects = useMemo(() =>
    {
        return availableEffects.filter(effect => effect.colorMatrix);
    }, [ availableEffects ]);

    const getCompositeEffects = useMemo(() =>
    {
        return availableEffects.filter(effect => effect.texture);
    }, [ availableEffects ]);

    const getEffectList = useCallback(() =>
    {
        if(currentTab === CameraEditorTabs.COLORMATRIX)
        {
            return getColorMatrixEffects;
        }

        return getCompositeEffects;
    }, [ currentTab, getColorMatrixEffects, getCompositeEffects ]);

    const getSelectedEffectIndex = useCallback((name: string) =>
    {
        if(!name || !name.length || !selectedEffects || !selectedEffects.length) return -1;

        return selectedEffects.findIndex(effect => (effect.effect.name === name));
    }, [ selectedEffects ])

    const getCurrentEffectIndex = useMemo(() =>
    {
        return getSelectedEffectIndex(selectedEffectName)
    }, [ selectedEffectName, getSelectedEffectIndex ])

    const getCurrentEffect = useMemo(() =>
    {
        if(!selectedEffectName) return null;

        return (selectedEffects[getCurrentEffectIndex] || null);
    }, [ selectedEffectName, getCurrentEffectIndex, selectedEffects ]);

    const setSelectedEffectAlpha = useCallback((alpha: number) =>
    {
        const index = getCurrentEffectIndex;

        if(index === -1) return;

        setSelectedEffects(prevValue =>
        {
            const clone = [ ...prevValue ];
            const currentEffect = clone[index];

            clone[getCurrentEffectIndex] = new RoomCameraWidgetSelectedEffect(currentEffect.effect, alpha);

            return clone;
        });
    }, [ getCurrentEffectIndex, setSelectedEffects ]);

    const getCurrentPictureUrl = useMemo(() =>
    {
        return GetRoomCameraWidgetManager().applyEffects(picture.texture, selectedEffects, isZoomed).src;
    }, [ picture, selectedEffects, isZoomed ]);

    const processAction = useCallback((type: string, effectName: string = null) =>
    {
        switch(type)
        {
            case 'close':
                onClose();
                return;
            case 'cancel':
                onCancel();
                return;
            case 'checkout':
                onCheckout(getCurrentPictureUrl);
                return;
            case 'change_tab':
                setCurrentTab(String(effectName));
                return;
            case 'select_effect': {
                let existingIndex = getSelectedEffectIndex(effectName);

                if(existingIndex >= 0) return;
                
                const effect = availableEffects.find(effect => (effect.name === effectName));

                if(!effect) return;

                setSelectedEffects(prevValue =>
                {
                    return [ ...prevValue, new RoomCameraWidgetSelectedEffect(effect, 1) ];
                });

                setSelectedEffectName(effect.name);
                return;
            }
            case 'remove_effect': {
                let existingIndex = getSelectedEffectIndex(effectName);

                if(existingIndex === -1) return;

                setSelectedEffects(prevValue =>
                {
                    const clone = [ ...prevValue ];

                    clone.splice(existingIndex, 1);

                    return clone;
                });

                if(selectedEffectName === effectName) setSelectedEffectName(null);
                return;
            }
            case 'clear_effects':
                setSelectedEffectName(null);
                setSelectedEffects([]);
                return;
            case 'download': {
                const image = new Image();
                            
                image.src = getCurrentPictureUrl
                            
                const newWindow = window.open('');
                newWindow.document.write(image.outerHTML);
                return;
            }
            case 'zoom':
                setIsZoomed(!isZoomed);
                return;
        }
    }, [ isZoomed, availableEffects, selectedEffectName, getCurrentPictureUrl, getSelectedEffectIndex, onCancel, onCheckout, onClose, setIsZoomed, setSelectedEffects ]);

    useEffect(() =>
    {
        const thumbnails: CameraPictureThumbnail[] = [];

        for(const effect of availableEffects)
        {
            thumbnails.push(new CameraPictureThumbnail(effect.name, GetRoomCameraWidgetManager().applyEffects(picture.texture, [ new RoomCameraWidgetSelectedEffect(effect, 1) ], false).src));
        }

        setEffectsThumbnails(thumbnails);
    }, [ picture, availableEffects ]);

    return (
        <NitroCardView className="nitro-camera-editor">
            <NitroCardHeaderView headerText={ LocalizeText('camera.editor.button.text') } onCloseClick={ event => processAction('close') } />
            <NitroCardTabsView>
                { TABS.map(tab =>
                {
                    return <NitroCardTabsItemView key={ tab } isActive={ currentTab === tab } onClick={ event => processAction('change_tab', tab) }><i className={ 'icon icon-camera-' + tab }></i></NitroCardTabsItemView>
                }) }
            </NitroCardTabsView>
            <NitroCardContentView>
                <Grid>
                    <Column size={ 5 } overflow="hidden">
                        <CameraWidgetEffectListView myLevel={ myLevel } selectedEffects={ selectedEffects } effects={ getEffectList() } thumbnails={ effectsThumbnails } processAction={ processAction } />
                    </Column>
                    <Column size={ 7 } justifyContent="between" overflow="hidden">
                        <Column center>
                            <LayoutImage imageUrl={ getCurrentPictureUrl } className="picture-preview" />
                            { selectedEffectName &&
                                <Column center fullWidth gap={ 1 }>
                                    <Text>{ LocalizeText('camera.effect.name.' + selectedEffectName) }</Text>
                                    <ReactSlider
                                        className={ 'nitro-slider' }
                                        min={ 0 }
                                        max={ 1 }
                                        step={ 0.01 }
                                        value={ getCurrentEffect.alpha }
                                        onChange={ event => setSelectedEffectAlpha(event) }
                                        renderThumb={ (props, state) => <div { ...props }>{ state.valueNow }</div> } />
                                </Column> }
                        </Column>
                        <Flex justifyContent="between">
                            <ButtonGroup>
                                <Button onClick={ event => processAction('clear_effects') }>
                                    <FaTrash className="fa-icon" />
                                </Button>
                                <Button onClick={ event => processAction('download') }>
                                    <FaSave className="fa-icon" />
                                </Button>
                                <Button onClick={ event => processAction('zoom') }>
                                    { isZoomed && <FaSearchMinus className="fa-icon" /> }
                                    { !isZoomed && <FaSearchPlus className="fa-icon" /> }
                                </Button>
                            </ButtonGroup>
                            <Flex gap={ 1 }>
                                <Button onClick={ event => processAction('cancel') }>
                                    { LocalizeText('generic.cancel') }
                                </Button>
                                <Button onClick={ event => processAction('checkout') }>
                                    { LocalizeText('camera.preview.button.text') }
                                </Button>
                            </Flex>
                        </Flex>
                    </Column>
                </Grid>
            </NitroCardContentView>
        </NitroCardView>
    );
}
