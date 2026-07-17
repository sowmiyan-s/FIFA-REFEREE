import { render, screen } from '@testing-library/react';
import { InsightsPanel } from './src/components/InsightsPanel';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

describe('InsightsPanel component', () => {
  it('renders correctly', () => {
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
    render(<InsightsPanel 
        matchedObj={mockMatch as any}
        customVideoUrl=""
        setCustomVideoUrl={vi.fn()}
        rightPanelTab="commentary"
        setRightPanelTab={vi.fn()}
        activeEvents={[]}
        revealedEventIds={[]}
        selectedEventId=""
        onSelectEventId={vi.fn()}
        streamTranscript={[]}
        isLoadingTranscript={false}
        transcriptError=""
        commentarySearchQuery=""
        setCommentarySearchQuery={vi.fn()}
        isSpeechListening={false}
        speechTranscript=""
        speechTranslation=""
        isSpeechTranslating={false}
        translationLanguage="en"
        translatedTranscriptCache={{}}
        onAskCommentatorQuote={vi.fn()}
        activePlayEvent={null}
        onClosePanel={vi.fn()}
    />);
    expect(screen.getByText(/Live Broadcast & Insights/i)).toBeInTheDocument();
  });
});
