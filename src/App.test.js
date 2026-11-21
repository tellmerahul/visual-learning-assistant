import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./hooks/useVoiceCommands', () => ({
  useVoiceCommands: () => ({
    supported: false,
    listening: false,
    lastHeard: '',
  }),
}));

test('renders hero and input panel', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /Visual Learning Assistant/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Input' })).toBeInTheDocument();
  expect(screen.getByText(/Study from what you see/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Explanation help/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Analyze ke baad/i)).toBeInTheDocument();
  expect(screen.getByText(/What this tool is for/i)).toBeInTheDocument();
});