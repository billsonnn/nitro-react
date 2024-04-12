import { DetailedHTMLProps, forwardRef, HTMLAttributes, MouseEvent, PropsWithChildren } from 'react';
import { FaTimes } from 'react-icons/fa';
import { classNames, DraggableWindow, DraggableWindowPosition, DraggableWindowProps } from '../common';
import { NitroItemCountBadge } from './NitroItemCountBadge';

const classes = {
    base: 'flex flex-col rounded shadow',
    themes: {
        'primary': 'border'
    }
}

const NitroCardMain = forwardRef<HTMLDivElement, PropsWithChildren<{
    theme?: 'primary';
} & DraggableWindowProps> & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>>((props, ref) =>
{
    const { theme = 'primary', uniqueKey = null, handleSelector = '.drag-handler', windowPosition = DraggableWindowPosition.CENTER, disableDrag = false, className = null, ...rest } = props;

    return (
        <DraggableWindow disableDrag={ disableDrag } handleSelector={ handleSelector } uniqueKey={ uniqueKey } windowPosition={ windowPosition }>
            <div
                ref={ ref }
                className={ classNames(
                    classes.base,
                    classes.themes[theme],
                    className
                ) }
                { ...rest } />
        </DraggableWindow>
    );
});

NitroCardMain.displayName = 'NitroCardMain';

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
            }

            return (
                <div ref={ ref } className={ classNames('relative flex items-center justify-center flex-column drag-handler', className) }>
                    <div className="flex items-center justify-center w-full">
                        <span>{ headerText }</span>
                        <div className="absolute flex items-center justify-center right-2" onClick={ onCloseClick } onMouseDownCapture={ onMouseDown }>
                            <FaTimes className="fa-icon w-[12px] h-[12px]" />
                        </div>
                    </div>
                </div>
            )
        });

NitroCardHeader.displayName = 'NitroCardHeader';

const NitroCardContent = forwardRef<HTMLDivElement, DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>>((props, ref) =>
{
    const { className = null, ...rest } = props;

    return (
        <div
            ref={ ref }
            className={ classNames(
                'overflow-auto',
                className
            ) }
            { ...rest } />
    );
});

NitroCardContent.displayName = 'NitroCardContent';

const NitroCardTabsMain = forwardRef<HTMLDivElement, {
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>>((props, ref) =>
{
    const { className = null, ...rest } = props;

    return (
        <div
            ref={ ref }
            className={ classNames(
                'justify-center gap-1 flex',
                className)
            }
            { ...rest } />
    )
});

NitroCardTabsMain.displayName = 'NitroCardTabsMain';

const NitroCardTabsItem = forwardRef<HTMLDivElement, {
    isActive?: boolean;
    count?: number;
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>>((props, ref) =>
{
    const { isActive = false, count = 0, className = null, children = null, ...rest } = props;

    return (
        <div
            ref={ ref }
            className={ classNames(
                'overflow-hidden relative cursor-pointer rounded-t-lg flex',
                isActive && 'active',
                className)
            }
            { ...rest }>
            <div className="flex items-center justify-center shrink-0">
                { children }
            </div>
            { (count > 0) &&
                <NitroItemCountBadge count={ count } /> }
        </div>
    )
});

NitroCardTabsItem.displayName = 'NitroCardTabsItem';

export const NitroCard = {
    Main: NitroCardMain,
    Header: NitroCardHeader,
    Content: NitroCardContent
};

export const NitroCardTabs = {
    Main: NitroCardTabsMain,
    Item: NitroCardTabsItem
};
