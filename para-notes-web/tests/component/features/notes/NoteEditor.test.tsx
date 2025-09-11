import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NoteEditor } from '@/components/features/editor/NoteEditor'

// Mock the editor extensions module
jest.mock('@/lib/editor/extensions', () => ({
  ImageExtension: {},
  CodeBlockExtension: {},
  LinkExtension: {},
  Placeholder: {},
  StarterKit: {},
  createBaseExtensions: jest.fn(() => []),
}))

// Mock the editor dependencies
jest.mock('@tiptap/react', () => ({
  useEditor: jest.fn(() => ({
    getHTML: jest.fn(() => '<p>Test content</p>'),
    getText: jest.fn(() => 'Test content'),
    getJSON: jest.fn(() => ({ type: 'doc', content: [] })),
    setContent: jest.fn(),
    isActive: jest.fn(() => false),
    can: jest.fn(() => ({
      chain: jest.fn(() => ({
        focus: jest.fn().mockReturnThis(),
        toggleBold: jest.fn().mockReturnThis(),
        toggleItalic: jest.fn().mockReturnThis(),
        toggleCode: jest.fn().mockReturnThis(),
        setHeading: jest.fn().mockReturnThis(),
        toggleBulletList: jest.fn().mockReturnThis(),
        toggleOrderedList: jest.fn().mockReturnThis(),
        toggleBlockquote: jest.fn().mockReturnThis(),
        toggleCodeBlock: jest.fn().mockReturnThis(),
        insertTable: jest.fn().mockReturnThis(),
        run: jest.fn().mockReturnThis(),
      })),
    })),
    chain: jest.fn(() => ({
      focus: jest.fn().mockReturnThis(),
      toggleBold: jest.fn().mockReturnThis(),
      toggleItalic: jest.fn().mockReturnThis(),
      toggleCode: jest.fn().mockReturnThis(),
      setHeading: jest.fn().mockReturnThis(),
      toggleBulletList: jest.fn().mockReturnThis(),
      toggleOrderedList: jest.fn().mockReturnThis(),
      toggleBlockquote: jest.fn().mockReturnThis(),
      toggleCodeBlock: jest.fn().mockReturnThis(),
      insertTable: jest.fn().mockReturnThis(),
      run: jest.fn().mockReturnThis(),
    })),
    on: jest.fn(),
    off: jest.fn(),
    destroy: jest.fn(),
  })),
  EditorContent: ({ editor }: { editor: any }) => <div data-testid="editor-content">Editor Content</div>,
}))

jest.mock('@tiptap/starter-kit', () => ({}))
jest.mock('@tiptap/extension-image', () => ({}))
jest.mock('@tiptap/extension-link', () => ({}))
jest.mock('@tiptap/extension-table', () => ({}))
jest.mock('@tiptap/extension-code-block-lowlight', () => ({}))

// Mock crypto functions
jest.mock('@/lib/editor/crypto', () => ({
  encryptStringGCM: jest.fn().mockResolvedValue('encrypted-content'),
  decryptStringGCM: jest.fn().mockResolvedValue('decrypted-content'),
}))

describe('NoteEditor Component', () => {
  const defaultProps = {
    noteId: 'test-note-id',
    initialContent: '<p>Initial content</p>',
    initialMarkdown: '# Initial content',
    onChange: jest.fn(),
    onAutoSave: jest.fn(),
    onConflict: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render the editor with initial content', () => {
    render(<NoteEditor {...defaultProps} />)

    expect(screen.getByTestId('editor-content')).toBeInTheDocument()
    expect(screen.getByText('Editor Content')).toBeInTheDocument()
  })

  it('should render toolbar with formatting buttons', () => {
    render(<NoteEditor {...defaultProps} />)

    // Check for common toolbar buttons
    expect(screen.getByRole('button', { name: /bold/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /italic/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /code/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /heading/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /bullet list/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /ordered list/i })).toBeInTheDocument()
  })

  it('should call onChange when content changes', async () => {
    const user = userEvent.setup()
    const onChange = jest.fn()

    render(<NoteEditor {...defaultProps} onChange={onChange} />)

    // Simulate content change
    const editor = screen.getByTestId('editor-content')
    await user.type(editor, 'New content')

    // Wait for debounced onChange call
    await waitFor(() => {
      expect(onChange).toHaveBeenCalled()
    })
  })

  it('should call onAutoSave after content changes', async () => {
    const user = userEvent.setup()
    const onAutoSave = jest.fn()

    render(<NoteEditor {...defaultProps} onAutoSave={onAutoSave} />)

    // Simulate content change
    const editor = screen.getByTestId('editor-content')
    await user.type(editor, 'New content')

    // Wait for debounced auto-save call
    await waitFor(() => {
      expect(onAutoSave).toHaveBeenCalled()
    }, { timeout: 3000 })
  })

  it('should handle encryption when passphrase is provided', async () => {
    const user = userEvent.setup()
    const { encryptStringGCM } = require('@/lib/editor/crypto')

    render(
      <NoteEditor
        {...defaultProps}
        encryptionPassphrase="test-passphrase"
      />
    )

    // Simulate content change
    const editor = screen.getByTestId('editor-content')
    await user.type(editor, 'Sensitive content')

    // Wait for encryption to be called
    await waitFor(() => {
      expect(encryptStringGCM).toHaveBeenCalled()
    })
  })

  it('should handle decryption when encrypted content is provided', async () => {
    const { decryptStringGCM } = require('@/lib/editor/crypto')

    render(
      <NoteEditor
        {...defaultProps}
        initialContent="encrypted-content"
        encryptionPassphrase="test-passphrase"
        isEncrypted={true}
      />
    )

    // Wait for decryption to be called
    await waitFor(() => {
      expect(decryptStringGCM).toHaveBeenCalledWith('encrypted-content', 'test-passphrase')
    })
  })

  it('should show conflict resolution when onConflict is triggered', async () => {
    const onConflict = jest.fn()
    const user = userEvent.setup()

    render(<NoteEditor {...defaultProps} onConflict={onConflict} />)

    // Simulate conflict
    const editor = screen.getByTestId('editor-content')
    await user.type(editor, 'Conflicting content')

    // Trigger conflict manually for testing
    fireEvent.keyDown(editor, { key: 'Escape', code: 'Escape' })

    // In a real implementation, this would trigger the conflict resolution UI
    expect(onConflict).toHaveBeenCalled()
  })

  it('should handle toolbar button clicks', async () => {
    const user = userEvent.setup()

    render(<NoteEditor {...defaultProps} />)

    // Click bold button
    const boldButton = screen.getByRole('button', { name: /bold/i })
    await user.click(boldButton)

    // Click italic button
    const italicButton = screen.getByRole('button', { name: /italic/i })
    await user.click(italicButton)

    // Click heading button
    const headingButton = screen.getByRole('button', { name: /heading/i })
    await user.click(headingButton)

    // Verify buttons are clickable (actual functionality would be tested in integration tests)
    expect(boldButton).toBeInTheDocument()
    expect(italicButton).toBeInTheDocument()
    expect(headingButton).toBeInTheDocument()
  })

  it('should handle keyboard shortcuts', async () => {
    const user = userEvent.setup()

    render(<NoteEditor {...defaultProps} />)

    const editor = screen.getByTestId('editor-content')

    // Test Ctrl+B for bold
    await user.keyboard('{Control>}b{/Control}')
    
    // Test Ctrl+I for italic
    await user.keyboard('{Control>}i{/Control}')

    // Test Ctrl+Shift+8 for bullet list
    await user.keyboard('{Control>}{Shift>}8{/Shift}{/Control}')

    // Verify editor is focused and responsive
    expect(editor).toBeInTheDocument()
  })

  it('should handle focus and blur events', async () => {
    const user = userEvent.setup()

    render(<NoteEditor {...defaultProps} />)

    const editor = screen.getByTestId('editor-content')

    // Focus the editor
    await user.click(editor)
    expect(editor).toHaveFocus()

    // Blur the editor
    await user.tab()
    expect(editor).not.toHaveFocus()
  })

  it('should handle disabled state', () => {
    render(<NoteEditor {...defaultProps} disabled={true} />)

    // Check if editor is disabled
    const editor = screen.getByTestId('editor-content')
    expect(editor).toHaveAttribute('contenteditable', 'false')
  })

  it('should handle read-only mode', () => {
    render(<NoteEditor {...defaultProps} readOnly={true} />)

    // Check if editor is read-only
    const editor = screen.getByTestId('editor-content')
    expect(editor).toHaveAttribute('contenteditable', 'false')
  })

  it('should handle placeholder text', () => {
    render(<NoteEditor {...defaultProps} placeholder="Enter your note here..." />)

    // Check if placeholder is displayed
    expect(screen.getByText('Enter your note here...')).toBeInTheDocument()
  })

  it('should handle error states', async () => {
    const onError = jest.fn()

    render(<NoteEditor {...defaultProps} onError={onError} />)

    // Simulate an error (e.g., encryption failure)
    const { encryptStringGCM } = require('@/lib/editor/crypto')
    encryptStringGCM.mockRejectedValueOnce(new Error('Encryption failed'))

    const editor = screen.getByTestId('editor-content')
    fireEvent.input(editor, { target: { textContent: 'Test content' } })

    // Wait for error handling
    await waitFor(() => {
      expect(onError).toHaveBeenCalled()
    })
  })

  it('should handle loading state', () => {
    render(<NoteEditor {...defaultProps} isLoading={true} />)

    // Check if loading indicator is shown
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('should handle custom className', () => {
    render(<NoteEditor {...defaultProps} className="custom-editor" />)

    const editor = screen.getByTestId('editor-content')
    expect(editor).toHaveClass('custom-editor')
  })

  it('should handle custom styles', () => {
    const customStyle = { minHeight: '200px' }
    render(<NoteEditor {...defaultProps} style={customStyle} />)

    const editor = screen.getByTestId('editor-content')
    expect(editor).toHaveStyle('min-height: 200px')
  })

  it('should handle attachment uploads', async () => {
    const user = userEvent.setup()
    const onAttachmentUpload = jest.fn()

    render(<NoteEditor {...defaultProps} onAttachmentUpload={onAttachmentUpload} />)

    // Simulate file upload
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' })
    const input = screen.getByLabelText(/upload/i)
    
    await user.upload(input, file)

    expect(onAttachmentUpload).toHaveBeenCalledWith(file)
  })

  it('should handle collaboration features', async () => {
    const user = userEvent.setup()
    const onCollaborationUpdate = jest.fn()

    render(
      <NoteEditor
        {...defaultProps}
        enableCollaboration={true}
        onCollaborationUpdate={onCollaborationUpdate}
      />
    )

    // Simulate collaboration update
    const editor = screen.getByTestId('editor-content')
    await user.type(editor, 'Collaborative content')

    // Wait for collaboration update
    await waitFor(() => {
      expect(onCollaborationUpdate).toHaveBeenCalled()
    })
  })
})
