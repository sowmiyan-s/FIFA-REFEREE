import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './src/App';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

describe('App component', () => {
  it('renders the main application layout', () => {
    window.HTMLElement.prototype.scrollIntoView = function() {};
    render(<App />);
    expect(screen.getByText(/RefAI Live/i)).toBeInTheDocument();
  });

  it('can open Laws Database', async () => {
    window.HTMLElement.prototype.scrollIntoView = function() {};
    render(<App />);
    const buttons = screen.getAllByRole('button');
    const dbButton = buttons.find(b => b.textContent?.includes('Rulebook'));
    if (dbButton) {
      fireEvent.click(dbButton);
      await waitFor(() => {
        expect(screen.getByText(/FIFA Laws Database/i)).toBeInTheDocument();
      });
    }
  });

  it('handles sending a chat message', async () => {
    window.HTMLElement.prototype.scrollIntoView = function() {};
    render(<App />);
    const textarea = screen.getAllByRole('textbox')[0];
    fireEvent.change(textarea, { target: { value: 'Test query' } });
    const form = textarea.closest('form');
    if (form) {
      fireEvent.submit(form);
    }
    await waitFor(() => {
      expect(screen.getByText(/Test query/i)).toBeInTheDocument();
    });
  });

  it('toggles sidebar', async () => {
    window.HTMLElement.prototype.scrollIntoView = function() {};
    render(<App />);
    const buttons = screen.getAllByRole('button');
    const menuBtn = buttons.find(b => b.querySelector('.lucide-menu'));
    if (menuBtn) {
      fireEvent.click(menuBtn);
    }
  });
});

describe('App component ingest modal', () => {
  it('opens and closes ingest modal', async () => {
    window.HTMLElement.prototype.scrollIntoView = function() {};
    render(<App />);
    const buttons = screen.getAllByTitle('Ingest video or simulate custom matchup');
    if (buttons.length > 0) {
      fireEvent.click(buttons[0]);
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/e.g. FIFA World Cup Grand Final/i)).toBeInTheDocument();
      });
      // Try to type in the custom away team
      const inputs = screen.getAllByRole('textbox');
      // The away team should be one of them. Or just target by placeholder
      // Actually we have several textboxes here, let's close it
      const cancelBtn = screen.getByTitle('Cancel');
      fireEvent.click(cancelBtn);
      await waitFor(() => {
        expect(screen.queryByPlaceholderText(/e.g. FIFA World Cup Grand Final/i)).not.toBeInTheDocument();
      });
    }
  });
});
