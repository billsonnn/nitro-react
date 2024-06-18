import { FC, MouseEvent, useEffect, useState } from 'react';
import { ArrowContainer, Popover } from 'react-tiny-popover';
import { Flex, Grid, NitroCardContentView } from '../../../../common';

interface ChatInputStyleSelectorViewProps
{
    chatStyleId: number;
    chatStyleIds: number[];
    selectChatStyleId: (styleId: number) => void;
}

export const ChatInputStyleSelectorView: FC<ChatInputStyleSelectorViewProps> = props =>
{
    const { chatStyleId = 0, chatStyleIds = null, selectChatStyleId = null } = props;
    const [ target, setTarget ] = useState<(EventTarget & HTMLElement)>(null);
    const [ selectorVisible, setSelectorVisible ] = useState(false);

    const selectStyle = (styleId: number) =>
    {
        selectChatStyleId(styleId);
        setSelectorVisible(false);
    };

    const toggleSelector = (event: MouseEvent<HTMLElement>) =>
    {
        let visible = false;

        setSelectorVisible(prevValue =>
        {
            visible = !prevValue;

            return visible;
        });

        if(visible) setTarget((event.target as (EventTarget & HTMLElement)));
    };

    useEffect(() =>
    {
        if(selectorVisible) return;

        setTarget(null);
    }, [ selectorVisible ]);

    return (
        <>

            <Popover
                containerClassName="max-w-[276px] not-italic font-normal leading-normal text-left no-underline [text-shadow:none] normal-case tracking-[normal] [word-break:normal] [word-spacing:normal] whitespace-normal text-[.7875rem] [word-wrap:break-word] bg-[#dfdfdf] bg-clip-padding border-[1px] border-[solid] border-[#283F5D] rounded-[.25rem] [box-shadow:0_2px_#00000073] z-[1070]"
                content={ ({ position, childRect, popoverRect }) => (
                    <ArrowContainer // if you'd like an arrow, you can import the ArrowContainer!
                        arrowColor={ 'black' }
                        arrowSize={ 7 }
                        arrowStyle={ { bottom: 'calc(-.5rem - 1px)' } }
                        childRect={ childRect }
                        popoverRect={ popoverRect }
                        position={ position }
                    >
                        <NitroCardContentView className="bg-transparent !max-h-[200px]" overflow="hidden">
                            <Grid columnCount={ 3 } overflow="auto">
                                { chatStyleIds && (chatStyleIds.length > 0) && chatStyleIds.map((styleId) =>
                                {
                                    return (
                                        <Flex key={ styleId } center pointer className="h-[30px]" onClick={ event => selectStyle(styleId) }>
                                            <div key={ styleId } className="bubble-container relative w-[50px]">
                                                <div className={ `relative max-w-[350px] min-h-[26px] text-[14px] chat-bubble bubble-${ styleId }` }>&nbsp;</div>
                                            </div>
                                        </Flex>
                                    );
                                }) }
                            </Grid>
                        </NitroCardContentView>

                    </ArrowContainer>
                ) }
                isOpen={ selectorVisible }
                positions={ [ 'top' ] }
            >
                <div className="cursor-pointer nitro-icon chatstyles-icon" onClick={ toggleSelector } />

            </Popover>

        </>
    );
};
