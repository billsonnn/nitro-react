import classNames from 'classnames';
import { MouseEvent } from 'react';
import { LocalizeText } from '../../../../utils/LocalizeText';
import { NavigatorTabViewProps } from './NavigatorTabView.types';

export function NavigatorTabView(props: NavigatorTabViewProps): JSX.Element
{
    const { context = null, isActive = false, setTopLevelContext = null } = props;

    function onClick(event: MouseEvent): void
    {
        setTopLevelContext(context);
    }

    return (
        <button type="button" className={classNames({ 'btn': true, 'btn-primary': true, 'active': isActive })} onClick={ onClick }>{ LocalizeText(('navigator.toplevelview.' + context.code)) }</button>
    );
}
