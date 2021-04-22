import { FC, useCallback, useState } from 'react';
import { CatalogEvent } from '../../events';
import { DraggableWindow } from '../../hooks/draggable-window/DraggableWindow';
import { useUiEvent } from '../../hooks/events/ui/ui-event';
import { LocalizeText } from '../../utils/LocalizeText';
import { CatalogMessageHandler } from './CatalogMessageHandler';
import { CatalogViewProps } from './CatalogView.types';

export const CatalogView: FC<CatalogViewProps> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);

    const onCatalogEvent = useCallback((event: CatalogEvent) =>
    {
        switch(event.type)
        {
            case CatalogEvent.SHOW_CATALOG:
                setIsVisible(true);
                return;
            case CatalogEvent.TOGGLE_CATALOG:
                setIsVisible(value => !value);
                return;
        }
    }, []);

    useUiEvent(CatalogEvent.SHOW_CATALOG, onCatalogEvent);
    useUiEvent(CatalogEvent.TOGGLE_CATALOG, onCatalogEvent);

    function hideCatalog(): void
    {
        setIsVisible(false);
    }

    return (
        <>
            <CatalogMessageHandler  />
            { isVisible && <DraggableWindow handle=".drag-handler">
                <div className="nitro-catalog d-flex flex-column bg-primary border border-black shadow rounded">
                    <div className="drag-handler d-flex justify-content-between align-items-center px-3 pt-3">
                        <div className="h6 m-0">{ LocalizeText('catalog.title') }</div>
                        <button type="button" className="close" onClick={ hideCatalog }>
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                    <div className="d-flex p-3">
                        content
                    </div>
                </div>
            </DraggableWindow> }
        </>
    );
}
