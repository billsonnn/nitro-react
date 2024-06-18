import { DetailedHTMLProps, forwardRef, HTMLAttributes, MouseEvent, PropsWithChildren } from 'react';
import { DraggableWindow, DraggableWindowPosition, DraggableWindowProps } from '../common';
import { classNames } from './classNames';
import { NitroItemCountBadge } from './NitroItemCountBadge';

const NitroCardRoot = forwardRef<HTMLDivElement, PropsWithChildren<{
} & DraggableWindowProps> & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>>((props, ref) =>
{
    const { uniqueKey = null, handleSelector = '.drag-handler', windowPosition = DraggableWindowPosition.CENTER, disableDrag = false, className = null, ...rest } = props;

    return (
        <DraggableWindow disableDrag={ disableDrag } handleSelector={ handleSelector } uniqueKey={ uniqueKey } windowPosition={ windowPosition }>
            <div
                ref={ ref }
                className={ classNames(
                    'flex flex-col rounded-md shadow border-2 border-card-border overflow-hidden min-w-full min-h-full max-w-full max-h-full',
                    className
                ) }
                { ...rest } />
        </DraggableWindow>
    );
});

NitroCardRoot.displayName = 'NitroCardRoot';

const NitroCardHeader = forwardRef<HTMLDivElement, {
    headerText: string;
    onCloseClick?: (event: MouseEvent) => void;
        } & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>>((props, ref) =>
        {
            const { headerText = '', onCloseClick = null, className = null, ...rest } = props;

            const onMouseDown = (event: MouseEvent<HTMLDivElement>) =>
            {
                event.stopPropagation();
                event.nativeEvent.stopImmediatePropagation();
            };

            return (
                <div ref={ ref } className={ classNames('relative flex items-center justify-center flex-col drag-handler min-h-card-header max-h-card-header bg-card-header', className) }>
                    <div className="flex items-center justify-center w-full ">
                        <span className="text-xl text-white drop-shadow-lg">{ headerText }</span>
                        <div className="absolute flex items-center justify-center cursor-pointer right-2 p-[2px] ubuntu-close-button" onClick={ onCloseClick } onMouseDownCapture={ onMouseDown } />
                    </div>
                </div>
            );
        });

NitroCardHeader.displayName = 'NitroCardHeader';

const NitroCardContent = forwardRef<HTMLDivElement, {
    isLoading?: boolean;
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>>((props, ref) =>
{
    const { isLoading = false, className = null, children = null, ...rest } = props;

    return (
        <div
            ref={ ref }
            className={ classNames(
                'flex flex-col overflow-auto bg-card-content-area p-2 h-full',
                className
            ) }
            { ...rest }>
            { isLoading &&
                <div className="absolute top-0 left-0 z-10 opacity-50 size-full bg-muted" /> }
            { children }
        </div>
    );
});

NitroCardContent.displayName = 'NitroCardContent';

const NitroCardTabs = forwardRef<HTMLDivElement, {
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>>((props, ref) =>
{
    const { className = null, ...rest } = props;

    return (
        <div
            ref={ ref }
            className={ classNames(
                'justify-center gap-0.5 flex bg-card-tabs min-h-card-tabs max-h-card-tabs pt-1 border-b border-card-border px-2',
                className)
            }
            { ...rest } />
    );
});

NitroCardTabs.displayName = 'NitroCardTabs';

const NitroCardTabItem = forwardRef<HTMLDivElement, {
    isActive?: boolean;
    count?: number;
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>>((props, ref) =>
{
    const { isActive = false, count = 0, className = null, children = null, ...rest } = props;

    return (
        <div
            ref={ ref }
            className={ classNames(
                'overflow-hidden relative cursor-pointer rounded-t-md flex bg-card-tab-item px-3 py-1 z-[1] border-card-border border-t border-l border-r before:absolute before:w-[93%] before:h-[3px] before:rounded-md before:top-[1.5px] before:left-0 before:right-0 before:m-auto before:z-[1] before:bg-[#C2C9D1]',
                isActive && 'bg-card-tab-item-active -mb-[1px] before:bg-white',
                className)
            }
            { ...rest }>
            <div className="flex items-center justify-center shrink-0">
                { children }
            </div>
            { (count > 0) &&
                <NitroItemCountBadge count={ count } /> }
        </div>
    );
});

NitroCardTabItem.displayName = 'NitroCardTabItem';

export const NitroCard = Object.assign(NitroCardRoot, {
    Header: NitroCardHeader,
    Content: NitroCardContent,
    Tabs: NitroCardTabs,
    TabItem: NitroCardTabItem
});
