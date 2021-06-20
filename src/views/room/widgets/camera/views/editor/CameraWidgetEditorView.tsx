import classNames from 'classnames';
import { RoomCameraWidgetSelectedEffect } from 'nitro-renderer/src/nitro/camera/RoomCameraWidgetSelectedEffect';
import { FC, useCallback, useEffect, useState } from 'react';
import { GetRoomCameraWidgetManager } from '../../../../../../api';
import { NitroCardContentView } from '../../../../../../layout/card/content/NitroCardContentView';
import { NitroCardHeaderView } from '../../../../../../layout/card/header/NitroCardHeaderView';
import { NitroCardView } from '../../../../../../layout/card/NitroCardView';
import { NitroCardTabsView } from '../../../../../../layout/card/tabs/NitroCardTabsView';
import { NitroCardTabsItemView } from '../../../../../../layout/card/tabs/tabs-item/NitroCardTabsItemView';
import { LocalizeText } from '../../../../../../utils/LocalizeText';
import { useCameraWidgetContext } from '../../context/CameraWidgetContext';
import { CameraWidgetEditorTabs, CameraWidgetEditorViewProps } from './CameraWidgetEditorView.types';

export const CameraWidgetEditorView: FC<CameraWidgetEditorViewProps> = props =>
{
    const { availableEffects = null, onCloseClick = null, onCancelClick = null } = props;
    
    const TABS: string[] = [ CameraWidgetEditorTabs.COLORMATRIX, CameraWidgetEditorTabs.COMPOSITE ];
    const MY_LEVEL: number = 0;

    const cameraWidgetContext = useCameraWidgetContext();
    
    const [ currentTab, setCurrentTab ]                 = useState(CameraWidgetEditorTabs.COLORMATRIX);
    const [ selectedEffectName, setSelectedEffectName ] = useState(null);
    const [ effectsThumbnails, setEffectsThumbnails ]   = useState<{ name: string, image: HTMLImageElement }[]>([]);
    const [ isZoomed, setIsZoomed ]                     = useState(false);

    useEffect(() =>
    {
        const thumbnails = [];

        for(const effect of availableEffects)
        {
            let alpha = 126;

            if(effect.colorMatrix) alpha = 0.5;

            thumbnails.push({name: effect.name, image: GetRoomCameraWidgetManager().applyEffects(cameraWidgetContext.cameraRoll[cameraWidgetContext.selectedPictureIndex], [ new RoomCameraWidgetSelectedEffect(effect, alpha) ])});
        }

        setEffectsThumbnails(thumbnails);
    }, [ cameraWidgetContext.selectedPictureIndex, availableEffects ]);

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
        return GetRoomCameraWidgetManager().applyEffects(cameraWidgetContext.cameraRoll[cameraWidgetContext.selectedPictureIndex], cameraWidgetContext.selectedEffects);
    }, [ cameraWidgetContext.selectedEffects ]);

    const getEffectRangeConfig = useCallback(() =>
    {
        if(!selectedEffectName) return [0, 0];

        const selectedEffect = cameraWidgetContext.selectedEffects.find(effect => effect.effect.name === selectedEffectName);

        if(!selectedEffect) return [0, 0];

        let isColormatrix = selectedEffect.effect.colorMatrix != null;

        let max = 255;
        let step = 1;

        if(isColormatrix)
        {
            max = 1;
            step = 0.01;
        }

        return [max, step, selectedEffect.alpha];
    }, [ selectedEffectName, cameraWidgetContext.selectedEffects ]);

    const setSelectedEffectAlpha = useCallback((newAlpha: number) =>
    {
        if(!selectedEffectName) return;

        const selectedEffectIndex = cameraWidgetContext.selectedEffects.findIndex(effect => effect.effect.name === selectedEffectName);

        if(selectedEffectIndex === -1) return;

        const clone = Array.from(cameraWidgetContext.selectedEffects);

        const selectedEffect = clone[selectedEffectIndex];

        clone[selectedEffectIndex] = new RoomCameraWidgetSelectedEffect(selectedEffect.effect, newAlpha);

        cameraWidgetContext.setSelectedEffects(clone);
    }, [ selectedEffectName, cameraWidgetContext.selectedEffects ]);

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
            case 'change_tab':
                setCurrentTab(String(value));
                return;
            case 'select_effect':
                let existingIndex = -1;

                if(cameraWidgetContext.selectedEffects.length > 0)
                {
                    existingIndex = cameraWidgetContext.selectedEffects.findIndex(effect => effect.effect.name === value);

                    /*if(existingIndex > -1)
                    {
                        const clone = Array.from(cameraWidgetContext.selectedEffects);
                        clone.splice(existingIndex, 1);
                        
                        cameraWidgetContext.setSelectedEffects(clone);
                    }*/
                }
                
                if(existingIndex === -1)
                {
                    const effect = availableEffects.find(effect => effect.name === value);

                    let alpha = 126;

                    if(effect.colorMatrix) alpha = 0.5;
                    
                    cameraWidgetContext.setSelectedEffects([...cameraWidgetContext.selectedEffects, new RoomCameraWidgetSelectedEffect(effect, alpha)]);
                }
                
                if(selectedEffectName !== value)
                {
                    setSelectedEffectName(value);
                }
                else
                {
                    setSelectedEffectName(null);
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
                setIsZoomed(isZoomed => !isZoomed);
                return;
        }
    }, [ onCloseClick, onCancelClick, availableEffects, cameraWidgetContext.selectedEffects, selectedEffectName ]);

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
                                            <div key={ effect.name } className="col mb-3" onClick={ event => processAction('select_effect', effect.name) }>
                                                <div title={ LocalizeText('camera.effect.name.' + effect.name) } className="effect-thumbnail cursor-pointer position-relative border border-2 rounded d-flex flex-column justify-content-center align-items-center py-1">
                                                    <div className="effect-thumbnail-image rounded">
                                                        <img alt="" className="rounded" src={ getEffectThumbnail(effect.name) } />
                                                    </div>
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
                        <div className={ 'd-flex align-items-end picture-preview' + classNames({ ' zoomed': isZoomed }) } style={ { backgroundImage: 'url(' + getCurrentPicture().src + ')' } }>
                            { selectedEffectName && <div className="w-100 p-2 d-flex flex-column justify-content-center bg-black">
                                <div className="w-100 text-center">{ LocalizeText('camera.effect.name.' + selectedEffectName) + ' - ' + getEffectRangeConfig()[2] }</div>
                                <input type="range" min="0" max={ getEffectRangeConfig()[0] } step={ getEffectRangeConfig()[1] } value={ getEffectRangeConfig()[2] } onChange={ event => setSelectedEffectAlpha(Number(event.target.value)) } className="form-range w-100" />
                            </div> }
                        </div>
                        <div className="d-flex justify-content-between mt-2">
                            <div className="btn-group">
                                <button className="btn btn-primary" onClick={ event => processAction('clear_effects') }><i className="fas fa-trash"></i></button>
                                <button className="btn btn-primary" onClick={ event => processAction('download') }><i className="fas fa-save"></i></button>
                                <button className="btn btn-primary" onClick={ event => processAction('zoom') }><i className={"fas " + classNames({'fa-search-plus': !isZoomed, 'fa-search-minus': isZoomed})}></i></button>
                            </div>
                            <div className="d-flex justify-content-end">
                                <button className="btn btn-primary me-2" onClick={ event => processAction('cancel') }>{ LocalizeText('generic.cancel') }</button>
                                <button className="btn btn-success">{ LocalizeText('camera.preview.button.text') }</button>
                            </div>
                        </div>
                    </NitroCardContentView>
                </div>
            </div>
        </NitroCardView>
    );
}
