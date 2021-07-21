import { FC, useCallback, useState } from 'react';
import { NitroCardContentView, NitroCardHeaderView, NitroCardTabsItemView, NitroCardTabsView, NitroCardView } from '../../../../../../layout';
import { LocalizeText } from '../../../../../../utils/LocalizeText';
import { RoomThumbnailWidgetBuilderViewProps } from './RoomThumbnailWidgetBuilderView.props';

const TABS: string[] = [
    'navigator.thumbeditor.bgtab',
    'navigator.thumbeditor.objtab',
    'navigator.thumbeditor.toptab',
];

export const RoomThumbnailWidgetBuilderView: FC<RoomThumbnailWidgetBuilderViewProps> = props =>
{
    const { onCloseClick = null } = props;

    const [ currentTab, setCurrentTab ] = useState(TABS[0]);
    
    const processAction = useCallback((action: string, value?: string) =>
    {
        switch(action)
        {
            case 'change_tab':
                setCurrentTab(value);
                return;
        }
    }, [ setCurrentTab ]);
    
    return (
        <NitroCardView className="nitro-room-thumbnail-builder">
            <NitroCardHeaderView headerText={ LocalizeText('navigator.thumbeditor.caption') } onCloseClick={ onCloseClick } />
            <div className="d-flex">
                <div className="w-100">
                    <NitroCardTabsView>
                        { TABS.map(tab =>
                            {
                                return <NitroCardTabsItemView key={ tab } isActive={ currentTab === tab } onClick={ event => processAction('change_tab', tab) }>
                                    { LocalizeText(tab) }
                                </NitroCardTabsItemView>
                            }) }
                    </NitroCardTabsView>
                    <NitroCardContentView>
                        <div className="d-flex h-100 overflow-auto effects px-2">
                            <div className="row row-cols-3">
                                
                            </div>
                        </div>
                    </NitroCardContentView>
                </div>
                <div>
                    <NitroCardTabsView></NitroCardTabsView>
                    <NitroCardContentView>
                        <div className="d-flex justify-content-between mt-2">
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
};
