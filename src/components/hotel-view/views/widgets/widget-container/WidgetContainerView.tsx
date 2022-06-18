import { FC, useCallback } from 'react';
import { GetConfigurationManager, LocalizeText, NotificationUtilities } from '../../../../../api';

export interface WidgetContainerViewProps
{
    conf: any;
}

export const WidgetContainerView: FC<WidgetContainerViewProps> = props =>
{
    const { conf = null } = props;

    const getOption = useCallback((key: string) =>
    {
        const option = conf[key];

        if(!option) return null;

        switch(key)
        {
            case 'image':
                return GetConfigurationManager().interpolate(option);
        }

        return option;
    }, [ conf ]);

  	return (
        <div className="widgetcontainer widget d-flex flex-row overflow-hidden">
            <div className="widgetcontainer-image flex-shrink-0" style={ { backgroundImage: `url(${ getOption('image') })` } } />
            <div className="d-flex flex-column align-self-center">
                <h3 className="my-0">{ LocalizeText(`landing.view.${ getOption('texts') }.header`) }</h3>
                <i>{ LocalizeText(`landing.view.${ getOption('texts') }.body`) }</i>
                <button className="btn btn-sm btn-gainsboro align-self-start px-3 mt-auto" onClick={ event => NotificationUtilities.openUrl(getOption('btnLink')) }>{ LocalizeText(`landing.view.${ getOption('texts') }.button`) }</button>
            </div>
        </div>
  	);
}
