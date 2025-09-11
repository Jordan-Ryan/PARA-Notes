import { beforeAll, beforeEach, afterAll, afterEach } from '@jest/globals'
import { device, expect as detoxExpect, element, by, waitFor } from 'detox'

beforeAll(async () => {
  await device.launchApp()
})

beforeEach(async () => {
  await device.reloadReactNative()
})

afterEach(async () => {
  // Clean up after each test
  await device.clearKeychain()
  await device.clearUserDefaults()
})

afterAll(async () => {
  // Clean up after all tests
  await device.terminateApp()
})

// Global test utilities
export const login = async (email: string = 'test@example.com', password: string = 'password123') => {
  await waitFor(element(by.id('email-input')))
    .toBeVisible()
    .withTimeout(10000)
  
  await element(by.id('email-input')).typeText(email)
  await element(by.id('password-input')).typeText(password)
  await element(by.id('login-button')).tap()
  
  await waitFor(element(by.id('dashboard')))
    .toBeVisible()
    .withTimeout(10000)
}

export const createNote = async (title: string, content: string, category: string = 'projects') => {
  await element(by.id('new-note-button')).tap()
  
  await waitFor(element(by.id('note-editor')))
    .toBeVisible()
    .withTimeout(5000)
  
  await element(by.id('note-title-input')).typeText(title)
  await element(by.id('note-content-input')).typeText(content)
  await element(by.id('category-picker')).tap()
  await element(by.text(category)).tap()
  
  await element(by.id('save-note-button')).tap()
  
  await waitFor(element(by.id('notes-list')))
    .toBeVisible()
    .withTimeout(5000)
}

export const searchNotes = async (query: string) => {
  await element(by.id('search-input')).typeText(query)
  await element(by.id('search-button')).tap()
}

export const logout = async () => {
  await element(by.id('profile-tab')).tap()
  await element(by.id('logout-button')).tap()
  
  await waitFor(element(by.id('login-screen')))
    .toBeVisible()
    .withTimeout(5000)
}
