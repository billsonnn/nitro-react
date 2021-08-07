import { IRoomCameraWidgetSelectedEffect, RoomCameraWidgetSelectedEffect } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { GetRoomCameraWidgetManager } from '../../../../../../api';
import { NitroCardContentView, NitroCardHeaderView, NitroCardTabsItemView, NitroCardTabsView, NitroCardView } from '../../../../../../layout';
import { LocalizeText } from '../../../../../../utils/LocalizeText';
import { CameraPictureThumbnail } from '../../common/CameraPictureThumbnail';
import { CameraWidgetEditorTabs, CameraWidgetEditorViewProps } from './CameraWidgetEditorView.types';
import { CameraWidgetEffectListView } from './effect-list/CameraWidgetEffectListView';

const TABS: string[] = [ CameraWidgetEditorTabs.COLORMATRIX, CameraWidgetEditorTabs.COMPOSITE ];

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
        if(currentTab === CameraWidgetEditorTabs.COLORMATRIX)
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

    const setCurrentEffectAlpha = useCallback((alpha: number) =>
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
                onCheckout();
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
            case 'download':
                //window.open(getCurrentPicture().src, '_blank');
                return;
            case 'zoom':
                setIsZoomed(!isZoomed);
                return;
        }
    }, [ isZoomed, availableEffects, getSelectedEffectIndex, selectedEffectName, onCancel, onCheckout, onClose, setIsZoomed, setSelectedEffects ]);

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
                <div className="row h-100">
                    <div className="col-5 d-flex flex-column h-100">
                        <CameraWidgetEffectListView myLevel={ myLevel } selectedEffects={ selectedEffects } effects={ getEffectList() } thumbnails={ effectsThumbnails } processAction={ processAction } />
                    </div>
                    <div className="col-7 d-flex flex-column h-100">
                        <div className="picture-preview">
                            <img alt="" src={ getCurrentPictureUrl } />
                        </div>
                    </div>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    );
}
