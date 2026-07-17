import { render, screen } from '@testing-library/react';
import App from './src/App';
import { describe, it, expect } from 'vitest';

describe('App component', () => {
  it('renders the main application layout', () => {
    render(<App />);
    expect(screen.getByText(/RefAI Live/i)).toBeInTheDocument();
  });
});
