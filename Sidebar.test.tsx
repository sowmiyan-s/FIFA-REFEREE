import { render, screen } from '@testing-library/react';
import { Sidebar } from './src/components/Sidebar';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

describe('Sidebar component', () => {
  it('renders without crashing', () => {
    render(<Sidebar 
        isAudioEnabled={true}
        setIsAudioEnabled={vi.fn()}
        translationLanguage="en"
        setTranslationLanguage={vi.fn()}
        isSpeechListening={false}
        setIsSpeechListening={vi.fn()}
        systemLatency={45}
    />);
    expect(screen.getByText(/FIFA World Cup 2026/i)).toBeInTheDocument();
  });
});
