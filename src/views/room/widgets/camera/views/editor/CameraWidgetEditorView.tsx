import classNames from 'classnames';
import { RoomCameraWidgetEditorSelectedEffect } from 'nitro-renderer/src/nitro/room/camera-widget/RoomCameraWidgetEditorSelectedEffect';
import { FC, useCallback, useEffect, useState } from 'react';
import { GetRoomEngine } from '../../../../../../api';
import { NitroCardContentView } from '../../../../../../layout/card/content/NitroCardContentView';
import { NitroCardHeaderView } from '../../../../../../layout/card/header/NitroCardHeaderView';
import { NitroCardView } from '../../../../../../layout/card/NitroCardView';
import { NitroCardTabsView } from '../../../../../../layout/card/tabs/NitroCardTabsView';
import { NitroCardTabsItemView } from '../../../../../../layout/card/tabs/tabs-item/NitroCardTabsItemView';
import { LocalizeText } from '../../../../../../utils/LocalizeText';
import { CameraWidgetEditorTabs, CameraWidgetEditorViewProps } from './CameraWidgetEditorView.types';

export const CameraWidgetEditorView: FC<CameraWidgetEditorViewProps> = props =>
{
    const TABS: string[] = [ CameraWidgetEditorTabs.COLORMATRIX, CameraWidgetEditorTabs.COMPOSITE ];
    const MY_LEVEL: number = 0;
    
    const [ currentTab, setCurrentTab ]             = useState(CameraWidgetEditorTabs.COLORMATRIX);
    const [ isZoomed, setIsZoomed ]                 = useState(false);
    const [ selectedEffects, setSelectedEffects ]   = useState<RoomCameraWidgetEditorSelectedEffect[]>([]);
    const [ effectsThumbnails, setEffectThumbnails ] = useState<{name: string, image: HTMLImageElement}[]>([]);

    useEffect(() =>
    {
        const thumbnails = [];

        for(const effect of props.availableEffects)
        {
            let alpha = 126;

            if(effect.colorMatrix.length > 0) alpha = 0.5;

            thumbnails.push({name: effect.name, image: GetRoomEngine().roomCameraWidgetManager.editImage(props.picture, [new RoomCameraWidgetEditorSelectedEffect(effect, alpha)])});
        }

        setEffectThumbnails(thumbnails);
    }, [ props.availableEffects ]);

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
            return props.availableEffects.filter(effect => effect.colorMatrix.length > 0);
        }
        else
        {
            return props.availableEffects.filter(effect => effect.colorMatrix.length === 0);
        }
    }, [ currentTab, props.availableEffects ]);

    const processAction = useCallback((type: string, value: string | number = null) =>
    {
        switch(type)
        {
            case 'close':
                props.onCloseClick();
                return;
            case 'change_tab':
                setCurrentTab(String(value));
                return;
            case 'zoom':
                setIsZoomed(isZoomed => !isZoomed);
                return;
        }
    }, []);

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
                                            <div key={ effect.name } className="col mb-3">
                                                <div title={ LocalizeText('camera.effect.name.' + effect.name) } className="effect-thumbnail cursor-pointer position-relative border border-2 rounded d-flex flex-column justify-content-center align-items-center py-1">
                                                    <div className="effect-thumbnail-image rounded">
                                                        <img className="rounded" src={ getEffectThumbnail(effect.name) } />
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
                        <div className="bg-black rounded">
                            <div className={ 'picture-preview rounded' + classNames({ ' zoomed': isZoomed }) } style={ { backgroundImage: 'url(' + props.picture.src + ')' } }></div>
                        </div>
                        <div className="d-flex mt-2">
                            <button className="btn btn-primary btn-sm me-2">{ LocalizeText('save') }</button>
                            <button className="btn btn-primary btn-sm" onClick={ event => processAction('zoom') }>{ LocalizeText('room.zoom.button.text') }</button>
                        </div>
                    </NitroCardContentView>
                </div>
            </div>
            <NitroCardContentView>
                <div className="d-flex justify-content-end">
                    <button className="btn btn-primary me-2">{ LocalizeText('generic.cancel') }</button>
                    <button className="btn btn-success">{ LocalizeText('camera.preview.button.text') }</button>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    );
}
