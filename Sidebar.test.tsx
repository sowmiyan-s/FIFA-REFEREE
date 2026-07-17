import { render, screen, fireEvent } from '@testing-library/react';
import { Sidebar } from './src/components/Sidebar';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

describe('Sidebar component', () => {
  it('renders and interacts', () => {
    const onToggleAudio = vi.fn();
    const onChangeTranslationLanguage = vi.fn();
    const onToggleSpeechMic = vi.fn();

    render(<Sidebar 
        isAudioEnabled={true}
        onToggleAudio={onToggleAudio}
        audioFeedback=""
        translationLanguage="en"
        onChangeTranslationLanguage={onChangeTranslationLanguage}
        isSpeechListening={false}
        onToggleSpeechMic={onToggleSpeechMic}
        systemLatency={45}
        onOpenIngestModal={vi.fn()}
        onCloseSidebar={vi.fn()}
    />);
    
    expect(screen.getByText(/FIFA World Cup 2026/i)).toBeInTheDocument();
    
    const audioCheckbox = screen.getByRole('checkbox');
    fireEvent.click(audioCheckbox);
    expect(onToggleAudio).toHaveBeenCalledWith(false);

    const langSelect = screen.getByRole('combobox');
    fireEvent.change(langSelect, { target: { value: 'es' } });
    expect(onChangeTranslationLanguage).toHaveBeenCalledWith('es');
  });
});
