import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Heading from '@tiptap/extension-heading'
import ListItem from '@tiptap/extension-list-item'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import Placeholder from '@tiptap/extension-placeholder'
import { parseRichText } from '@/utils'

interface Props {
  name: string
  handleChange: (name: string, value: string) => void
  content?: string 
}

const RichTextInput = ({ name, handleChange, content }: Props) => {
  const editor = useEditor({
    content,
    onUpdate: ({ editor }) => {
      const content = editor.getHTML()
      handleChange(name, parseRichText(content))
    },
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: `Enter ${name}`,
        // place holder does not show without these psuedo classes
        // https://github.com/ueberdosis/tiptap/issues/2659
        emptyNodeClass:
          'first:before:text-gray-400 first:before:float-left first:before:content-[attr(data-placeholder)] first:before:pointer-events-none',
      }),
      Heading.configure({
        HTMLAttributes: {
          class: 'text-xl font-bold capitalize',
          levels: [2],
        },
      }),
      ListItem,
      BulletList.configure({
        HTMLAttributes: {
          class: 'list-disc ml-2',
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: 'list-decimal ml-2',
        },
      }),
    ],
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          'shadow appearance-none min-h-[150px] border rounded w-full py-2 px-3 bg-white text-black text-sm mt-0 md:mt-3 leading-tight focus:outline-none focus:shadow-outline',
      },
    },

  })
  if (!editor) {
    return null
  }
  return (
    <div className='flex flex-col justify-stretch min-h-[200px] border rounded border-b-0'>
      <div className='flex items-center gap-2 mb-2'>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded ${editor.isActive('bold') ? 'bg-gray-200' : ''
            }`}
          title='Bold (Ctrl+B)'
        >
          Bold
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded ${editor.isActive('italic') ? 'bg-gray-200' : ''
            }`}
          title='Italic (Ctrl+I)'
        >
          Italic
        </button>
        <button
          type='button'
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive('heading', { level: 2 }) ? 'is-active' : ''
          }
        >
          Heading
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded ${editor.isActive('bulletList') ? 'bg-gray-200' : ''
            }`}
          title='Bullet List'
        >
          Bullet List
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded ${editor.isActive('orderedList') ? 'bg-gray-200' : ''
            }`}
          title='Ordered List'
        >
          orderd list
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}

export default RichTextInput