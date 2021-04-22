import { NavigatorResultListsViewProps } from './NavigatorResultListsView.types';
import { NavigatorResultListView } from './result-list/NavigatorResultListView';

export function NavigatorResultListsView(props: NavigatorResultListsViewProps): JSX.Element
{
    const { resultLists = null } = props;

    return (
        <div className="nitro-navigator-result-lists w-100">
            { resultLists && resultLists.length &&  resultLists.map((resultList, index) =>
                {
                    return <NavigatorResultListView key={ index } resultList={ resultList } />
                })
            }
        </div>
    );
}
