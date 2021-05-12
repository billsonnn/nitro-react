import { ToolbarMeViewProps } from './ToolbarMeView.types';

export function ToolbarMeView(props: ToolbarMeViewProps): JSX.Element
{
    return (<div className="d-flex nitro-toolbar-me px-1 py-2">
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
    </div>);
}
