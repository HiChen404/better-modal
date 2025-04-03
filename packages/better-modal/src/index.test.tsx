import { render, screen } from '@testing-library/react'
import App from './app'
import { describe, it, expect } from 'vitest'
describe('App', () => {
  it('should render', async () => {
    render(<App />)
    const res = await screen.findByText('App')
    expect(res.textContent).toBe('App')
  })
})
