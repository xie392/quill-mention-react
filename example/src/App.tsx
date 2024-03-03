import { useEffect, useRef } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.core.css'
import { Data } from 'src/type'
import './App.scss'
import '../../dist'

const data = [
	{ id: 1, name: '张三', image: 'https://picsum.photos/30' },
	{ id: 2, name: '李四', image: 'https://picsum.photos/30' },
	{ id: 3, name: '王五', image: 'https://picsum.photos/30' },
	{ id: 4, name: '赵六', image: 'https://picsum.photos/30' },
	{ id: 5, name: '田七', image: 'https://picsum.photos/30' },
	{ id: 6, name: '吴八', image: 'https://picsum.photos/30' },
	{ id: 7, name: '周九', image: 'https://picsum.photos/30' },
	{ id: 8, name: '郑十', image: 'https://picsum.photos/30' },
	{ id: 9, name: '陈十一', image: 'https://picsum.photos/30' },
	{ id: 10, name: '刘十二', image: 'https://picsum.photos/30' }
]

const App = () => {
	const quillRef = useRef<HTMLDivElement | null>(null)
	const asyncQuillRef = useRef<HTMLDivElement | null>(null)
	const customQuillRef = useRef<HTMLDivElement | null>(null)

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

		if (!asyncQuillRef.current) return

		new Quill(asyncQuillRef.current, {
			placeholder: '输入 @ 插入提及, 等待 1 秒后展示数据',
			modules: {
				mention: {
					/**
					 * 触发字符，用于触发提及, 默认为 @
					 */
					triggerChar: ['@'],
					/**
					 * 可以为异步函数也可以为同步
					 *
					 * @returns
					 */
					source: async () => {
						// 这里模拟请求数据时等待
						await new Promise((resolve) => setTimeout(resolve, 1000))
						return data
					}
				}
			}
		})

		if (!customQuillRef.current) return
		new Quill(customQuillRef.current, {
			placeholder: '输入 @ 插入提及, 自定义列表',
			modules: {
				mention: {
					/**
					 * 触发字符，用于触发提及, 默认为 @
					 */
					triggerChar: ['@'],
					/**
					 * 可以为异步函数也可以为同步
					 *
					 * @returns
					 */
					source: () => data,
					/**
					 * 自定义列表
					 */
					item: (data: Data) => (
						<div className="flex items-center">
							<img src={data?.image} alt="" className="mr-2 w-5 h-5 rounded-full object-cover" />
							{data.name}
						</div>
					)
				}
			}
		})
	}, [])

	return (
		<>
			<main className="max-w-[1000px] mx-auto py-10">
				<h1 className="text-2xl font-bold mb-5">Quill Mention React</h1>
				<p className="mb-10 text-sm">
					输入"@"插入提及，参考&nbsp;
					<a
						className="text-blue-500 hover:underline"
						target="_blank"
						href="https://github.com/quill-mention/quill-mention/tree/master"
					>
						quill-mention
					</a>
					，本插件仅供学习参考，如需使用到生产环境，建议按照自己需求自行修改。
				</p>

				<div className="mb-10">
					<h1 className="text-xl font-bold mb-5">简单的演示</h1>
					<div className="border min-h-16 rounded" ref={quillRef}></div>
				</div>

				<div className="mb-10">
					<h1 className="text-xl font-bold mb-5">异步的演示</h1>
					<div className="border min-h-16 rounded" ref={asyncQuillRef}></div>
				</div>

				<div className="mb-10">
					<h1 className="text-xl font-bold mb-5">自定义渲染列表</h1>
					<div className="border min-h-16 rounded" ref={customQuillRef}></div>
				</div>
			</main>
		</>
	)
}

export default App
