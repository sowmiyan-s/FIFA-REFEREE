import { render, screen } from '@testing-library/react';
import { LawsDatabase } from './src/components/LawsDatabase';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

describe('LawsDatabase component', () => {
  it('renders correctly', () => {
    render(<LawsDatabase 
        showRulebookPanel={true}
        setShowRulebookPanel={vi.fn()}
        rulebookSearchQuery=""
        setRulebookSearchQuery={vi.fn()}
        filteredRulebookList={[]}
    />);
    expect(screen.getByText(/FIFA Laws Database/i)).toBeInTheDocument();
  });
});
