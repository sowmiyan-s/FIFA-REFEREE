import { render, screen, fireEvent } from '@testing-library/react';
import { InsightsPanel } from './src/components/InsightsPanel';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

describe('InsightsPanel component', () => {
  it('renders correctly and handles interactions', () => {
    const mockMatch = {
      id: "test",
      homeTeam: "A",
      awayTeam: "B",
      time: "10'",
      score: "0-0",
      status: "live",
      videoUrl: "https://youtube.com/embed/123",
      league: "FIFA",
      context: "Test"
    };

    const setCustomVideoUrl = vi.fn();
    const setRightPanelTab = vi.fn();
    const setCommentarySearchQuery = vi.fn();
    const onAskCommentatorQuote = vi.fn();
    const onSelectEventId = vi.fn();

    render(<InsightsPanel 
        matchedObj={mockMatch as any}
        customVideoUrl=""
        setCustomVideoUrl={setCustomVideoUrl}
        rightPanelTab="commentary"
        setRightPanelTab={setRightPanelTab}
        activeEvents={[
          {id: "e1", type: "foul", time: "11", description: "Foul", team: "home"}
        ]}
        revealedEventIds={["e1"]}
        selectedEventId=""
        onSelectEventId={onSelectEventId}
        streamTranscript={[
          {id: "t1", text: "Test transcript", timestamp: "10'", isHighlighted: false}
        ]}
        isLoadingTranscript={false}
        transcriptError=""
        commentarySearchQuery=""
        setCommentarySearchQuery={setCommentarySearchQuery}
        isSpeechListening={false}
        speechTranscript="Speaking"
        speechTranslation="Translation"
        isSpeechTranslating={false}
        translationLanguage="en"
        translatedTranscriptCache={{}}
        onAskCommentatorQuote={onAskCommentatorQuote}
        activePlayEvent={null}
        onClosePanel={vi.fn()}
    />);
    
    expect(screen.getByText(/Live Broadcast & Insights/i)).toBeInTheDocument();
    
    // Switch to Vision Events tab
    const eventsTab = screen.getByText(/Vision Events/i);
    fireEvent.click(eventsTab);
    expect(setRightPanelTab).toHaveBeenCalledWith('telemetry');

    // Search query
    const searchInput = screen.getByPlaceholderText(/Filter commentaries/i);
    fireEvent.change(searchInput, { target: { value: 'foul' } });
    expect(setCommentarySearchQuery).toHaveBeenCalledWith('foul');

    // Ask quote
    const askButtons = screen.getAllByRole('button');
    const askBtn = askButtons.find(b => b.textContent?.includes('Ask RefAI'));
    if (askBtn) fireEvent.click(askBtn);
    
    // Video url change
    const videoInput = screen.getByPlaceholderText(/Paste video url.../i);
    fireEvent.change(videoInput, { target: { value: 'https://youtube.com/watch?v=456' } });
    expect(setCustomVideoUrl).toHaveBeenCalledWith('https://youtube.com/watch?v=456');
  });
});
