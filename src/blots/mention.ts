import Quill from 'quill'
import QuillEmbed from 'quill/blots/embed'
import { Data } from '../type'

const Embed = Quill.import('blots/embed') as QuillEmbed

// @ts-ignore
class MentionBlot extends Embed {
	public static blotName = 'mention'
	public static className = 'ql-mention-denotation-char'
	public static tagName = 'span'

	/**
	 * 使用给定数据创建一个新节点。
	 *
	 * @param {Data} data -创建节点的数据
	 */
	static create(data: Data) {
		const node = super.create(data.name)
		node.nodeData = data
		node.innerHTML = data.name
		node.style.color = data.color || '#0c70f5'
		return node
	}

	/**
	 * 整个功能的描述。
	 *
	 * @param {Data} domNode -参数描述
	 */
	static value(domNode: Data) {
		return domNode.nodeData
	}
}

Quill.register({ 'blots/mention': MentionBlot })
