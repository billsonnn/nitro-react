import { FC, MouseEvent } from 'react';
import { FaFlag } from 'react-icons/fa';
import { Base, Column, ColumnProps, Flex } from '..';

interface NitroCardHeaderViewProps extends ColumnProps
{
    headerText: string;
    isGalleryPhoto?: boolean;
    noCloseButton?: boolean;
    onReportPhoto?: (event: MouseEvent) => void;
    onCloseClick: (event: MouseEvent) => void;
}

export const NitroCardHeaderView: FC<NitroCardHeaderViewProps> = props =>
{
    const { headerText = null, isGalleryPhoto = false, noCloseButton = false, onReportPhoto = null, onCloseClick = null, justifyContent = 'center', alignItems = 'center', classNames = [], children = null, ...rest } = props;



    const onMouseDown = (event: MouseEvent<HTMLDivElement>) =>
    {
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
    };

    return (
        <Column center className={ 'relative flex items-center justify-center flex-col drag-handler min-h-card-header max-h-card-header bg-card-header' } { ...rest }>
            <Flex center fullWidth>
                <span className="text-xl text-white drop-shadow-lg">{ headerText }</span>
                { isGalleryPhoto &&
                    <Base className="end-4 nitro-card-header-report-camera" position="absolute" onClick={ onReportPhoto }>
                        <FaFlag className="fa-icon" />
                    </Base>
                }
                <div className="absolute flex items-center justify-center cursor-pointer right-2 p-[2px] ubuntu-close-button" onClick={ onCloseClick } onMouseDownCapture={ onMouseDown }>
                </div>

            </Flex>
        </Column>
    );
};
