import { render, screen } from '@testing-library/react';
import { ChatWorkspace } from './src/components/ChatWorkspace';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

describe('ChatWorkspace component', () => {
  it('renders correctly', () => {
    window.HTMLElement.prototype.scrollIntoView = function() {};
    render(<ChatWorkspace 
        chatMessages={[]}
        activePlayEvent={null}
        inputMessage=""
        setInputMessage={vi.fn()}
        isTyping={false}
        onSendMessage={vi.fn()}
        onOpenIngestModal={vi.fn()}
    />);
    expect(screen.getByPlaceholderText(/Ask RefAI about the soccer rules.../i)).toBeInTheDocument();
  });
});
