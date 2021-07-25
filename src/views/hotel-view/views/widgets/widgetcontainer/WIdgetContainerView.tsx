import { FC, useCallback, useMemo } from 'react';
import { GetConfigurationManager } from '../../../../../api/core/';
import { WidgetContainerViewProps } from './WidgetContainerView.types';

export const WidgetContainerView: FC<WidgetContainerViewProps> = props =>
{
    const { conf = null } = props;

    const config = useMemo(() =>
    {
        const config = {};

        if(!conf || !conf.length) return config;

        let options = conf.split(",");

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
        <div className="widgetcontainer widget">
            { getOption('image') }
    	</div>
  	);
}
