import { FC, useMemo } from 'react';
import { GetConfigurationValue } from '../../api';
import { Base, BaseProps } from '../Base';

export interface LayoutRoomThumbnailViewProps extends BaseProps<HTMLDivElement>
{
    roomId?: number;
    customUrl?: string;
}

export const LayoutRoomThumbnailView: FC<LayoutRoomThumbnailViewProps> = props =>
{
    const { roomId = -1, customUrl = null, shrink = true, overflow = 'hidden', classNames = [], children = null, ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'relative w-[110px] h-[110px] bg-[url("@/assets/images/navigator/thumbnail_placeholder.png")] bg-no-repeat bg-center', 'rounded', '!border-[1px] !border-[solid] !border-[#283F5D]' ];

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ classNames ]);

    const getImageUrl = useMemo(() =>
    {
        if(customUrl && customUrl.length) return (GetConfigurationValue<string>('image.library.url') + customUrl);

        return (GetConfigurationValue<string>('thumbnails.url').replace('%thumbnail%', roomId.toString()));
    }, [ customUrl, roomId ]);

    return (
        <Base classNames={ getClassNames } overflow={ overflow } shrink={ shrink } { ...rest }>
            { getImageUrl && <img alt="" src={ getImageUrl } /> }
            { children }
        </Base>
    );
};
