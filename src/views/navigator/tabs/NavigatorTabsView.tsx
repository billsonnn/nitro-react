import { NavigatorTabsViewProps } from './NavigatorTabsView.types';
import { NavigatorTabView } from './tab/NavigatorTabView';

export function NavigatorTabsView(props: NavigatorTabsViewProps): JSX.Element
{
    const { topLevelContext = null, topLevelContexts = null, setTopLevelContext = null } = props;

    return (
        <div className="d-flex flex-column p-3">
            { topLevelContexts && topLevelContexts.length && 
                <div className="btn-group w-100 mb-2">
                    { topLevelContexts.map((context, index) =>
                        {
                            return <NavigatorTabView key={ index } context={ context } isActive={ context === topLevelContext } setTopLevelContext={ setTopLevelContext } />
                        }) }
                </div> }
        </div>
    );
}
