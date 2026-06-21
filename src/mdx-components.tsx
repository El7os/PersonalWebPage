import type { MDXComponents } from 'mdx/types'
import BeforeAfter from './components/BeforeAfter'
import GameVideo from './components/GameVideo'
import GameGif from './components/GameGif'
import CodeBlock from './components/CodeBlock'
import CodeInline from './components/CodeInline'
import MathBlock from './components/MathBlock'
import MathInline from './components/MathInline'
import Notification from './components/Notification'

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        ...components,
        BeforeAfter,
        GameVideo,
        GameGif,
        CodeBlock,
        CodeInline,
        MathBlock,
        MathInline,
        Notification,
    }
}
