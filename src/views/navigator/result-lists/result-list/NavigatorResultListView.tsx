import classNames from 'classnames';
import { useState } from 'react';
import { LocalizeText } from '../../../../utils/LocalizeText';
import { NavigatorResultListViewProps } from './NavigatorResultListView.types';
import { NavigatorResultView } from './result/NavigatorResultView';

export function NavigatorResultListView(props: NavigatorResultListViewProps): JSX.Element
{
    const { resultList = null, isLast = false } = props;

    const [ isExtended, setIsExtended ] = useState(true);

    function toggleList(): void
    {
        setIsExtended(!isExtended);
    }

    function getListCode(): string
    {
        let name = resultList.code;

        if((!name || name.length == 0) && (resultList.data && resultList.data.length > 0))
        {
            return resultList.data;
        }

        if(resultList.code.startsWith('${'))
        {
            name = name.substr(2, (name.length - 3));
        }
        else
        {
            name = ('navigator.searchcode.title.' + name);
        }

        return name;
    }

    return (
        <div>
            <div className="d-flex">
                <div className=" mr-2" onClick={ toggleList }><i className={classNames({ 'fas': true, 'fa-plus': !isExtended, 'fa-minus': isExtended })}></i></div>
                <div className="align-self-center w-100">{ LocalizeText(getListCode()) }</div>
            </div>
            { isExtended && resultList && resultList.rooms.map((room, index) =>
                {
                    return <NavigatorResultView key={ index } result={ room }  />
                })
            }
            { !isLast && <hr className="mb-2" /> }
        </div>
    );
}
