import { CSSProperties } from 'react';
import { TransitionStatus } from 'react-transition-group';
import { ENTERING, EXITING } from 'react-transition-group/Transition';
import { TransitionAnimationTypes } from './TransitionAnimationTypes';

export function getTransitionAnimationStyle(type: string, transition: TransitionStatus, timeout: number = 300): Partial<CSSProperties>
{
    switch(type)
    {
        case TransitionAnimationTypes.BOUNCE:
            switch(transition)
            {
                default:
                    return {}
                case ENTERING:
                    return {
                        animationName: 'bounceIn',
                        animationDuration: `${ timeout }ms`
                    }
                case EXITING:
                    return {
                        animationName: 'bounceOut',
                        animationDuration: `${ timeout }ms`
                    }
            }
        case TransitionAnimationTypes.SLIDE_LEFT:
            switch(transition)
            {
                default:
                    return {}
                case ENTERING:
                    return {
                        animationName: 'slideInLeft',
                        animationDuration: `${ timeout }ms`
                    }
                case EXITING:
                    return {
                        animationName: 'slideOutLeft',
                        animationDuration: `${ timeout }ms`
                    }
            }
        case TransitionAnimationTypes.SLIDE_RIGHT:
            switch(transition)
            {
                default:
                    return {}
                case ENTERING:
                    return {
                        animationName: 'slideInRight',
                        animationDuration: `${ timeout }ms`
                    }
                case EXITING:
                    return {
                        animationName: 'slideOutRight',
                        animationDuration: `${ timeout }ms`
                    }
            }
        case TransitionAnimationTypes.FLIP_X:
            switch(transition)
            {
                default:
                    return {}
                case ENTERING:
                    return {
                        animationName: 'flipInX',
                        animationDuration: `${ timeout }ms`
                    }
                case EXITING:
                    return {
                        animationName: 'flipOutX',
                        animationDuration: `${ timeout }ms`
                    }
            }
        case TransitionAnimationTypes.FADE_UP:
            switch(transition)
            {
                default:
                    return {}
                case ENTERING:
                    return {
                        animationName: 'fadeInUp',
                        animationDuration: `${ timeout }ms`
                    }
                case EXITING:
                    return {
                        animationName: 'fadeOutDown',
                        animationDuration: `${ timeout }ms`
                    }
            }
        case TransitionAnimationTypes.FADE_IN:
            switch(transition)
            {
                default:
                    return {}
                case ENTERING:
                    return {
                        animationName: 'fadeIn',
                        animationDuration: `${ timeout }ms`
                    }
                case EXITING:
                    return {
                        animationName: 'fadeOut',
                        animationDuration: `${ timeout }ms`
                    }
            }
        case TransitionAnimationTypes.FADE_DOWN:
            switch(transition)
            {
                default:
                    return {}
                case ENTERING:
                    return {
                        animationName: 'fadeInDown',
                        animationDuration: `${ timeout }ms`
                    }
                case EXITING:
                    return {
                        animationName: 'fadeOutUp',
                        animationDuration: `${ timeout }ms`
                    }
            }
        case TransitionAnimationTypes.HEAD_SHAKE:
            switch(transition)
            {
                default:
                    return {}
                case ENTERING:
                    return {
                        animationName: 'headShake',
                        animationDuration: `${ timeout }ms`
                    }
            }
    }

    return null;
}
