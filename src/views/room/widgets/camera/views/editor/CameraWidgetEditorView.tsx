import classNames from 'classnames';
import { RoomCameraWidgetSelectedEffect } from 'nitro-renderer/src/nitro/camera/RoomCameraWidgetSelectedEffect';
import { FC, useCallback, useEffect, useState } from 'react';
import { GetRoomCameraWidgetManager } from '../../../../../../api';
import { NitroCardContentView, NitroCardHeaderView, NitroCardTabsItemView, NitroCardTabsView, NitroCardView } from '../../../../../../layout';
import { LocalizeText } from '../../../../../../utils/LocalizeText';
import { useCameraWidgetContext } from '../../context/CameraWidgetContext';
import { CameraWidgetEditorTabs, CameraWidgetEditorViewProps } from './CameraWidgetEditorView.types';

export const CameraWidgetEditorView: FC<CameraWidgetEditorViewProps> = props =>
{
    const { availableEffects = null, myLevel = null, onCloseClick = null, onCancelClick = null, onCheckoutClick = null } = props;
    
    const TABS: string[] = [ CameraWidgetEditorTabs.COLORMATRIX, CameraWidgetEditorTabs.COMPOSITE ];

    const cameraWidgetContext = useCameraWidgetContext();
    
    const [ currentTab, setCurrentTab ]                 = useState(CameraWidgetEditorTabs.COLORMATRIX);
    const [ selectedEffectName, setSelectedEffectName ] = useState(null);
    const [ effectsThumbnails, setEffectsThumbnails ]   = useState<{ name: string, image: HTMLImageElement }[]>([]);

    useEffect(() =>
    {
        const thumbnails = [];

        for(const effect of availableEffects)
        {
            thumbnails.push({name: effect.name, image: GetRoomCameraWidgetManager().applyEffects(cameraWidgetContext.cameraRoll[cameraWidgetContext.selectedPictureIndex], [ new RoomCameraWidgetSelectedEffect(effect, 1) ], false)});
        }

        setEffectsThumbnails(thumbnails);
    }, [ cameraWidgetContext, availableEffects ]);

    const getEffectThumbnail = useCallback((effectName: string) =>
    {
        const search = effectsThumbnails.find(thumbnail => thumbnail.name === effectName);

        if(search) return search.image.src;

        return null;
    }, [ effectsThumbnails ]);

    const getEffectList = useCallback(() =>
    {
        if(currentTab === CameraWidgetEditorTabs.COLORMATRIX)
        {
            return availableEffects.filter(effect => effect.colorMatrix);
        }
        else
        {
            return availableEffects.filter(effect => effect.texture);
        }
    }, [ currentTab, availableEffects ]);

    const getCurrentPicture = useCallback(() =>
    {
        return GetRoomCameraWidgetManager().applyEffects(cameraWidgetContext.cameraRoll[cameraWidgetContext.selectedPictureIndex], cameraWidgetContext.selectedEffects, cameraWidgetContext.isZoomed);
    }, [ cameraWidgetContext ]);

    const getCurrentEffectAlpha = useCallback(() =>
    {
        if(!selectedEffectName) return 0;

        const selectedEffect = cameraWidgetContext.selectedEffects.find(effect => effect.effect.name === selectedEffectName);

        if(!selectedEffect) return 0;

        return selectedEffect.alpha;
    }, [ selectedEffectName, cameraWidgetContext.selectedEffects ]);

    const getEffectIndex = useCallback((effectName) =>
    {
        return cameraWidgetContext.selectedEffects.findIndex(effect => effect.effect.name === effectName);
    }, [ cameraWidgetContext.selectedEffects ])

    const setSelectedEffectAlpha = useCallback((newAlpha: number) =>
    {
        if(!selectedEffectName) return;

        const selectedEffectIndex = getEffectIndex(selectedEffectName);

        if(selectedEffectIndex === -1) return;

        const clone = Array.from(cameraWidgetContext.selectedEffects);

        const selectedEffect = clone[selectedEffectIndex];

        clone[selectedEffectIndex] = new RoomCameraWidgetSelectedEffect(selectedEffect.effect, newAlpha);

        cameraWidgetContext.setSelectedEffects(clone);
    }, [ selectedEffectName, getEffectIndex, cameraWidgetContext ]);

    const processAction = useCallback((type: string, value: string | number = null) =>
    {
        switch(type)
        {
            case 'close':
                onCloseClick();
                return;
            case 'cancel':
                onCancelClick();
                return;
            case 'checkout':
                onCheckoutClick();
                return;
            case 'change_tab':
                setCurrentTab(String(value));
                return;
            case 'select_effect':
                {
                    let existingIndex = -1;

                    if(cameraWidgetContext.selectedEffects.length > 0)
                    {
                        existingIndex = getEffectIndex(value);
                    }
                    
                    let effect = null;

                    if(existingIndex === -1)
                    {
                        effect = availableEffects.find(effect => effect.name === value);
                        
                        if(effect.minLevel > myLevel) return;
                        
                        cameraWidgetContext.setSelectedEffects([...cameraWidgetContext.selectedEffects, new RoomCameraWidgetSelectedEffect(effect, 0.5)]);
                    }
                    
                    if(effect && effect.minLevel > myLevel) return;

                    if(selectedEffectName !== value)
                    {
                        setSelectedEffectName(value);
                    }
                    else
                    {
                        setSelectedEffectName(null);
                    }
                }
                return;
            case 'remove_effect':
                {
                    const existingIndex = getEffectIndex(value);

                    if(existingIndex > -1)
                    {
                        const effect = cameraWidgetContext.selectedEffects[existingIndex];

                        if(effect.effect.name === selectedEffectName)
                        {
                            setSelectedEffectName(null);
                        }

                        const clone = Array.from(cameraWidgetContext.selectedEffects);
                        clone.splice(existingIndex, 1);
                        
                        cameraWidgetContext.setSelectedEffects(clone);
                    }
                }
                return;
            case 'clear_effects':
                setSelectedEffectName(null);
                cameraWidgetContext.setSelectedEffects([]);
                return;
            case 'download':
                window.open(getCurrentPicture().src, '_blank');
                return;
            case 'zoom':
                cameraWidgetContext.setIsZoomed(!cameraWidgetContext.isZoomed);
                return;
        }
    }, [onCloseClick, onCancelClick, onCheckoutClick, cameraWidgetContext, getCurrentPicture, myLevel, selectedEffectName, getEffectIndex, availableEffects]);

    return (
        <NitroCardView className="nitro-camera-editor">
            <NitroCardHeaderView headerText={ LocalizeText('camera.editor.button.text') } onCloseClick={ event => processAction('close') } />
            <div className="d-flex">
                <div className="w-100">
                    <NitroCardTabsView>
                        { TABS.map(tab =>
                            {
                                return <NitroCardTabsItemView key={ tab } isActive={ currentTab === tab } onClick={ event => processAction('change_tab', tab) }><i className={ 'icon icon-camera-' + tab }></i></NitroCardTabsItemView>
                            }) }
                    </NitroCardTabsView>
                    <NitroCardContentView>
                        <div className="d-flex h-100 overflow-auto effects px-2">
                            <div className="row row-cols-3">
                                { getEffectList().map(effect =>
                                    {
                                        return (
                                            <div key={ effect.name } className="col mb-3 position-relative">
                                                { getEffectIndex(effect.name) > -1 && <button className="btn btn-danger btn-sm p-0 position-absolute btn-remove-effect" onClick={ event => processAction('remove_effect', effect.name) }><i className="fas fa-times"></i></button> }
                                                <div title={ effect.minLevel <= myLevel ? LocalizeText('camera.effect.name.' + effect.name) : LocalizeText('camera.effect.required.level') + ' ' + effect.minLevel } onClick={ event => processAction('select_effect', effect.name) } className={"effect-thumbnail cursor-pointer position-relative border border-2 rounded d-flex flex-column justify-content-center align-items-center py-1" + classNames({' active': selectedEffectName === effect.name})}>
                                                    { effect.minLevel <= myLevel && <div className="effect-thumbnail-image border">
                                                        <img alt="" src={ getEffectThumbnail(effect.name) } />
                                                    </div> }
                                                    { effect.minLevel > myLevel && <div className="text-center text-black">
                                                        <div><i className="fas fa-lock"></i></div>
                                                        <div className="fw-bold">{ effect.minLevel }</div>
                                                    </div> }
                                                </div>
                                            </div>
                                        );
                                    }) }
                            </div>
                        </div>
                    </NitroCardContentView>
                </div>
                <div className="w-100">
                    <NitroCardTabsView></NitroCardTabsView>
                    <NitroCardContentView>
                        <div className="d-flex align-items-end picture-preview border" style={ { backgroundImage: 'url(' + getCurrentPicture().src + ')' } }>
                            { selectedEffectName && <div className="w-100 p-2 d-flex flex-column justify-content-center slider">
                                <div className="w-100 text-center">{ LocalizeText('camera.effect.name.' + selectedEffectName) + ' - ' + getCurrentEffectAlpha() }</div>
                                <input type="range" min="0" max="1" step="0.01" value={ getCurrentEffectAlpha() } onChange={ event => setSelectedEffectAlpha(Number(event.target.value)) } className="form-range w-100" />
                            </div> }
                        </div>
                        <div className="d-flex justify-content-between mt-2">
                            <div className="btn-group">
                                <button className="btn btn-primary" onClick={ event => processAction('clear_effects') }><i className="fas fa-trash"></i></button>
                                <button className="btn btn-primary" onClick={ event => processAction('download') }><i className="fas fa-save"></i></button>
                                <button className="btn btn-primary" onClick={ event => processAction('zoom') }><i className={"fas " + classNames({'fa-search-plus': !cameraWidgetContext.isZoomed, 'fa-search-minus': cameraWidgetContext.isZoomed})}></i></button>
                            </div>
                            <div className="d-flex justify-content-end">
                                <button className="btn btn-primary me-2" onClick={ event => processAction('cancel') }>{ LocalizeText('generic.cancel') }</button>
                                <button className="btn btn-success" onClick={ event => processAction('checkout') }>{ LocalizeText('camera.preview.button.text') }</button>
                            </div>
                        </div>
                    </NitroCardContentView>
                </div>
            </div>
        </NitroCardView>
    );
}
