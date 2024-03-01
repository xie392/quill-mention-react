import Quill from 'quill'
import QuillEmbed from 'quill/blots/embed'
import ScrollBlot from 'quill/blots/scroll'

const Embed = Quill.import('blots/embed') as QuillEmbed

// @ts-ignore
class MentionBlot extends Embed {
	public static blotName = 'mention'
	public static className = 'quill-mention'
	public static tagName = 'span'

	static create(data: { name: string }) {
		const node = super.create(data.name)
		node.nodeData = data
		node.innerHTML = data.name
		node.setAttribute('spellcheck', 'false')
		node.setAttribute('autocomplete', 'off')
		node.setAttribute('autocorrect', 'off')
		node.setAttribute('autocapitalize', 'off')
		node.setAttribute('class', 'ql-mention-denotation')
		node.setAttribute('contentEditable', 'false')
		return node
	}

	static value(domNode: any) {
		return domNode.nodeData
	}

	constructor(scroll: ScrollBlot, node: Node) {
		super(scroll, node)
	}
}

Quill.register({ 'blots/mention': MentionBlot })
