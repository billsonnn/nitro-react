import { MysteryBoxKeysUpdateEvent } from '@nitrots/nitro-renderer';
import { FC, useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { ColorUtils, LocalizeText } from '../../../../api';
import { Base, Column, Flex, LayoutGridItem, Text } from '../../../../common';
import { useNitroEvent } from '../../../../hooks';

const colorMap = {
    'purple': 9452386,
    'blue': 3891856,
    'green': 6459451,
    'yellow': 10658089,
    'lilac': 6897548,
    'orange': 10841125,
    'turquoise': 2661026,
    'red': 10104881
}

export const MysteryBoxExtensionView: FC<{}> = props =>
{
    const [ isOpen, setIsOpen ] = useState<boolean>(true);
    const [ keyColor, setKeyColor ] = useState<string>('');
    const [ boxColor, setBoxColor ] = useState<string>('');

    useNitroEvent<MysteryBoxKeysUpdateEvent>(MysteryBoxKeysUpdateEvent.MYSTERY_BOX_KEYS_UPDATE, event =>
    {
        setKeyColor(event.keyColor);
        setBoxColor(event.boxColor);
    });

    const getRgbColor = (color: string) =>
    {
        const colorInt = colorMap[color];

        return ColorUtils.int2rgb(colorInt);
    }

    if(keyColor === '' && boxColor === '') return null;

    return (
        <Base className="nitro-notification-bubble rounded mysterybox-extension">
            <Column>
                <Flex alignItems="center" justifyContent="between" pointer onClick={ event => setIsOpen(value => !value) }>
                    <Text variant="white">{ LocalizeText('mysterybox.tracker.title') }</Text>
                    { isOpen && <FaChevronUp className="fa-icon" /> }
                    { !isOpen && <FaChevronDown className="fa-icon" /> }
                </Flex>
                { isOpen &&
                    <>
                        <Text variant="white">{ LocalizeText('mysterybox.tracker.description') }</Text>
                        <Flex justifyContent="center" alignItems="center" gap={ 2 }>
                            <LayoutGridItem className="mysterybox-container">
                                <div className="box-image flex-shrink-0" style={ { backgroundColor: getRgbColor(boxColor) } }>
                                    <div className="chain-overlay-image" />
                                </div>
                            </LayoutGridItem>
                            <LayoutGridItem className="mysterybox-container">
                                <div className="key-image flex-shrink-0" style={ { backgroundColor: getRgbColor(keyColor ) } }>
                                    <div className="key-overlay-image" />
                                </div>
                            </LayoutGridItem>
                        </Flex>
                    </> }
            </Column>
        </Base>
    );
}
