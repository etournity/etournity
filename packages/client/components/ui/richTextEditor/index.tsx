import classNames from 'classnames'
import React from 'react'
import styles from './richTextEditor.module.scss'
import { Editor } from '@tinymce/tinymce-react'

interface RichTextEditorProps {
  value?: string
  defaultValue?: string
  placeholder?: string
  onChange?: (value: string) => void
  validate?: (value: string | undefined) => string | null
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  validate,
  value,
  placeholder,
  defaultValue,
  onChange,
  ...rest
}) => (
  <div className={classNames(classNames, styles.container)} {...rest}>
    <div className={styles.input}>
      <Editor
        inline
        initialValue={defaultValue}
        value={value}
        apiKey={process.env.TINY_KEY}
        init={{
          skin: 'oxide-dark',
          placeholder,
          height: 500,
          menubar: false,
          automatic_uploads: false,
          toolbar:
            'undo redo | formatselect | ' +
            'bold italic | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist | ',
          block_formats:
            'Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4',
          plugins: 'paste',
          paste_block_drop: true,
          paste_data_images: false,
        }}
        onEditorChange={(value) => onChange?.(value)}
      />
      <span className={styles.attribution}>
        POWERED BY{' '}
        <a
          href="https://www.tiny.cloud"
          target="_blank"
          rel="noopener noreferrer"
        >
          TINY
        </a>
      </span>
    </div>
    <p className={classNames(styles.errorText)}>{validate?.(value)}</p>
  </div>
)
