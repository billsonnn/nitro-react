import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import { NitroLayoutButtonSize, NitroLayoutVariant } from '../common';

export interface NitroLayoutButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
{
    variant?: NitroLayoutVariant;
    size?: NitroLayoutButtonSize;
}
