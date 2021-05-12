import { MouseEventType } from 'nitro-renderer';
import { useEffect, useRef } from 'react';
import { ToolbarMeViewProps } from './ToolbarMeView.types';

export function ToolbarMeView(props: ToolbarMeViewProps): JSX.Element
{
    const { setMeExpanded = null } = props;

    const elementRef = useRef<HTMLDivElement>();

    useEffect(() =>
    {
        function onClick(event: MouseEvent): void
        {
            const element = elementRef.current;

            if((event.target !== element) && !element.contains((event.target as Node)))
            {
                setMeExpanded(false);
            }
        }

        document.addEventListener(MouseEventType.MOUSE_CLICK, onClick);

        return () =>
        {
            document.removeEventListener(MouseEventType.MOUSE_CLICK, onClick);
        }
    }, [ elementRef, setMeExpanded ]);

    return (
        <div ref={ elementRef } className="d-flex nitro-toolbar-me px-1 py-2">
            <div className="navigation-items">
                <div className="navigation-item">
                    <i className="icon icon-me-talents"></i>
                </div>
                <div className="navigation-item">
                    <i className="icon icon-me-helper-tool"></i>
                </div>
                <div className="navigation-item">
                    <i className="icon icon-me-achievements"></i>
                </div>
                <div className="navigation-item">
                    <i className="icon icon-me-profile"></i>
                </div>
                <div className="navigation-item">
                    <i className="icon icon-me-rooms"></i>
                </div>
                <div className="navigation-item">
                    <i className="icon icon-me-clothing"></i>
                </div>
                <div className="navigation-item">
                    <i className="icon icon-me-forums"></i>
                </div>
                <div className="navigation-item">
                    <i className="icon icon-me-settings"></i>
                </div>
            </div>
        </div>
    );
}
