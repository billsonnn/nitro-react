import { FC, useCallback, useMemo } from 'react';
import { GetConfigurationManager, LocalizeText } from '../../../../../api';
import { WidgetContainerViewProps } from './WidgetContainerView.types';

export const WidgetContainerView: FC<WidgetContainerViewProps> = props =>
{
    const { conf = null } = props;

    const config = useMemo(() =>
    {
        const config = {};

        if(!conf || !conf.length) return config;

        let options = conf.split(',');

        options.forEach(option =>
        {
            let [ key, value ] = option.split(':');

            if(key && value) config[key] = value;
        });

        return config;
    }, [ conf ]);

    const getOption = useCallback((key: string) =>
    {
        const option = config[key];

        if(!option) return null;

        switch(key)
        {
            case 'image':
                return GetConfigurationManager().interpolate(option);
        }

        return option;
    }, [ config ]);

  	return (
        <div className="widgetcontainer widget d-flex flex-row overflow-hidden">
            <div className="widgetcontainer-image flex-shrink-0" style={{ backgroundImage: `url(${getOption('image')})` }} />
            <div className="d-flex flex-column align-self-center">
                <h3 className="my-0">{LocalizeText(`landing.view.${getOption('texts')}.header`)}</h3>
                <i>{ LocalizeText(`landing.view.${getOption('texts')}.body`) }</i>
                <button className="btn btn-sm btn-gainsboro align-self-start px-3 mt-auto">{ LocalizeText(`landing.view.${getOption('texts')}.button`) }</button>
            </div>
    	</div>
  	);
}
