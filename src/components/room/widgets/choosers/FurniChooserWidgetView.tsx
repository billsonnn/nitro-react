import { ILinkEventTracker } from '@nitrots/nitro-renderer';
import { FC, useEffect } from 'react';
import { AddEventLinkTracker, LocalizeText, RemoveLinkEventTracker } from '../../../../api';
import { useFurniChooserWidget } from '../../../../hooks';
import { ChooserWidgetView } from './ChooserWidgetView';

export const FurniChooserWidgetView: FC<{}> = props =>
{
    const { items = null, onClose = null, selectItem = null, populateChooser = null } = useFurniChooserWidget();

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived: (url: string) =>
            {
                const parts = url.split('/');

                populateChooser();
            },
            eventUrlPrefix: 'furni-chooser/'
        };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, [ populateChooser ]);
    
    if(!items) return null;

    return <ChooserWidgetView title={ LocalizeText('widget.chooser.furni.title') } items={ items } selectItem={ selectItem } onClose={ onClose } />;
}
