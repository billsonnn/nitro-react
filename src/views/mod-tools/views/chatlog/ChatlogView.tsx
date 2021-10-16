import { UserProfileComposer } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { AutoSizer, CellMeasurerCache, List, ListRowProps, ListRowRenderer } from 'react-virtualized';
import { SendMessageHook } from '../../../../hooks';
import { ChatlogViewProps } from './ChatlogView.types';

export const ChatlogView: FC<ChatlogViewProps> = props =>
{
    const { record = null } = props;

    const cache = new CellMeasurerCache({
        defaultHeight: 20,
        fixedWidth: true
    });

    const rowRenderer: ListRowRenderer = (props: ListRowProps) =>
    {
        const item = record.chatlog[props.index];

        return (
            <div key={props.key} style={props.style} className="row chatlog-entry justify-content-start">
                <div className="col-md-auto text-center">{item.timestamp}</div>
                <div className="col-sm-2 justify-content-start username"><span className="fw-bold cursor-pointer" onClick={() => SendMessageHook(new UserProfileComposer(item.userId))}>{item.userName}</span></div>
                <div className="col-lg-auto justify-content-start">{item.message}</div>
            </div>
        );
    }

    return (
        <>
            {record && <div className="chatlog-messages w-100 h-100 overflow-hidden">
                <div className="row align-items-start w-100">
                    <div className="col-md-auto text-center">Time</div>
                    <div className="col-sm-2 username-label">User</div>
                    <div className="col-lg-auto">Message</div>
                </div>
                <div className="row w-100 h-100 chatlog">
                    <AutoSizer defaultWidth={400} defaultHeight={200}>
                        {({ height, width }) => 
                        {
                            return (
                                <List
                                    width={width}
                                    height={height}
                                    rowCount={record.chatlog.length}
                                    rowHeight={20}
                                    className={'chatlog-container'}
                                    rowRenderer={rowRenderer} />
                            )
                        }
                        }
                    </AutoSizer>
                </div>
            </div>}
        </>
    );
}
