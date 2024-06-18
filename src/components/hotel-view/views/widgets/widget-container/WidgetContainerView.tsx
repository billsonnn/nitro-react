import { GetConfiguration } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { LocalizeText, OpenUrl } from '../../../../../api';

export interface WidgetContainerViewProps
{
    conf: any;
}

export const WidgetContainerView: FC<WidgetContainerViewProps> = props =>
{
    const { conf = null } = props;

    const getOption = (key: string) =>
    {
        const option = conf[key];

        if(!option) return null;

        switch(key)
        {
            case 'image':
                return GetConfiguration().interpolate(option);
        }

        return option;
    };

    return (
        <div className="widgetcontainer widget flex flex-row overflow-hidden">
            <div className="widgetcontainer-image flex-shrink-0" style={ { backgroundImage: `url(${ getOption('image') })` } } />
            <div className="flex flex-col align-self-center">
                <h3 className="my-0">{ LocalizeText(`landing.view.${ getOption('texts') }.header`) }</h3>
                <i>{ LocalizeText(`landing.view.${ getOption('texts') }.body`) }</i>
                <button className="px-[.5rem] py-[.25rem]  rounded-[.2rem] align-self-start px-3 mt-auto text-[#000] bg-[#d9d9d9] border-[#d9d9d9] [box-shadow:inset_0_2px_#ffffff26,_inset_0_-2px_#0000001a,_0_1px_#0000001a]" onClick={ event => OpenUrl(getOption('btnLink')) }>{ LocalizeText(`landing.view.${ getOption('texts') }.button`) }</button>
            </div>
        </div>
    );
};
