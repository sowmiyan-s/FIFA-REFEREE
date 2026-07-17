import { render, screen, fireEvent } from '@testing-library/react';
import { ChatWorkspace } from './src/components/ChatWorkspace';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

describe('ChatWorkspace component', () => {
  it('renders and interacts correctly', () => {
    window.HTMLElement.prototype.scrollIntoView = function() {};
    const setInputMessage = vi.fn();
    const onSendMessage = vi.fn();

    render(<ChatWorkspace 
        chatMessages={[
          {id: "1", sender: "user", text: "Hello from user", timestamp: ""},
          {id: "2", sender: "ref", text: "Verdict test", timestamp: "", confidenceBadge: "99%", verdictBadge: "FOUL", rulebookContext: "LAW 12"}
        ]}
        activePlayEvent={null}
        inputMessage="Test input"
        setInputMessage={setInputMessage}
        isTyping={true}
        onSendMessage={onSendMessage}
        onOpenIngestModal={vi.fn()}
    />);
    
    expect(screen.getByText(/Hello from user/i)).toBeInTheDocument();
    expect(screen.getByText(/Verdict test/i)).toBeInTheDocument();

    const textarea = screen.getByPlaceholderText(/Ask RefAI about the soccer rules.../i);
    fireEvent.change(textarea, { target: { value: 'New message' } });
    expect(setInputMessage).toHaveBeenCalledWith('New message');

    // Submit form
    const form = textarea.closest('form');
    if (form) fireEvent.submit(form);

    // Enter key down
    fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter', shiftKey: false });

    // Click quick suggestion
    const buttons = screen.getAllByRole('button');
    const quickBtn = buttons.find(b => b.textContent?.includes('Ask RefAI'));
    if (quickBtn) fireEvent.click(quickBtn);
  });
});
