import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { GetConfigurationManager, LocalizeText } from '../../../../../api';
import { NotificationAlertView } from '../../../../../layout';
import { NotificationUtilities } from '../../../common/NotificationUtilities';
import { NotificationEventAlertViewProps } from './NotificationEventAlertView.types';

export const NotificationEventAlertView: FC<NotificationEventAlertViewProps> = props =>
{
    const { item = null, close = null, ...rest } = props;

    const [hasImage, updateHasImage] = useState(true);

    const mainRef = useRef<HTMLDivElement>();

    const visitUrl = useCallback(() =>
    {
        NotificationUtilities.openUrl(item.clickUrl);
        close();
    }, [item, close]);
    
    useEffect(() =>
    {
        if(!item.imageUrl) return
        let img = document.createElement('img');
        img.src = GetConfigurationManager().interpolate(item.imageUrl);

        img.onload = () =>
        {
            mainRef.current.prepend(img);
        };
    })

    return (
        <NotificationAlertView title={item.title} close={close} {...rest}>
            <div className="d-flex flex-row gap-1" ref={ mainRef }>
                { (item.messages.length > 0) && item.messages.map((message, index) =>
                    {
                        const htmlText = message.replace(/\r\n|\r|\n/g, '<br />');

                        return (
                            <div key={ index } dangerouslySetInnerHTML={ { __html: htmlText } } />
                        );
                })}
            </div>
            {item.clickUrlText &&
                <div className="d-flex justify-content-center align-items-center mt-1">
                    <button type="button" className="btn btn-primary" onClick={ visitUrl }>{ LocalizeText(item.clickUrlText) }</button>
                </div> }
        </NotificationAlertView>
    );
}
