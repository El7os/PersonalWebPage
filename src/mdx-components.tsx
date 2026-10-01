import type { MDXComponents } from 'mdx/types'
import BeforeAfter from './components/BeforeAfter'
import GameVideo from './components/GameVideo'
import GameGif from './components/GameGif'
import CodeBlock from './components/CodeBlock'
import Notification from './components/Notification'
import CodeInline from './components/CodeInline'
import MathBlock from './components/MathBlock'
import MathInline from './components/MathInline'
import Table from './components/Table'

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
        Table,
    }
}
