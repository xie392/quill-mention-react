![Quill Mention](./accets/ico.svg 'Quill Mention')

# Quill Mention React

Quill Mention React 是一个为 [Quill](https://quilljs.com/) 富文本编辑器提供提及功能的插件。本插件参考来自 [Quill Mention](https://github.com/quill-mention/quill-mention/tree/master)。

# 入门

## 安装

```shell
npm install quill-mention-react --save
# or
yarn add quill-mention-react
# or
pnpm add quill-mention
```

## 导入

```shell
import "quill-mention-react"
```

# 例子

```tsx
import 'quill-mention-react'
import { useEffect, useRef } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.core.css'

const data = [
	{ id: 1, name: '张三', image: 'https://picsum.photos/30' },
	{ id: 2, name: '李四', image: 'https://picsum.photos/30' },
	{ id: 3, name: '王五', image: 'https://picsum.photos/30' }
]

const App = () => {
	const quillRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		if (!quillRef.current) return

		new Quill(quillRef.current, {
			placeholder: '输入 @ 插入提及',
			modules: {
				mention: {
					/**
					 * 触发字符，用于触发提及
					 */
					triggerChar: ['@'],
					/**
					 * 可以为异步函数也可以为同步
					 *
					 * @returns
					 */
					source: () => data,
					/**
					 * 选择的回调
					 *
					 * @param {Data} data
					 */
					onSelect: (data: Data) => {
						console.log('onSelect', data)
					}
				}
			}
		})
	}, [])

	return <div ref={quillRef} />
}
```

> ps: 更多例子参考 `example` 目录

# 参数说明

```ts
/**
 * mention 配置
 */
export interface MentionOptions {
	/**
	 * 触发字符
	 * @default '@'
	 */
	targetChars: string[]
	/**
	 * 要展示的数据
	 * @example
	 * source: () => Promise<Data[]>
	 * source: () => Data[]
	 * @returns
	 */
	source: () => Promise<Data[]> | Data[]
	/**
	 * 选中时的回调
	 *
	 * @param {Data} data
	 * @returns
	 */
	onSelect?: (data: Data) => void
	/**
	 * 自定义渲染的元素
	 */
	item?: (data:Data) => React.ReactNode
}
```

