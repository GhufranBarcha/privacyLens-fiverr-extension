# PrivacyLens Fiverr for Firefox

## Overview

PrivacyLens Fiverr is a Firefox addon designed to enhance your privacy while using Fiverr. Fiverr doesn't have an inbuilt balance hider, which can be inconvenient when you don't want others to see your earnings, client information, or chats. This addon helps you hide that information with just a click.

## Features

- **Hide Financial Information**: Blur all balance amounts and prices across all Fiverr pages
- **Hide Usernames**: Blur client usernames throughout Fiverr
- **Dark/Light Mode**: Toggle between `Light` and `Dark` themes based on your preference
- **Hover Reveal**: Temporarily reveal hidden information by hovering over blurred elements (Work in progress)

## Installation

### From Firefox Add-ons Store (Coming Soon)

1. Visit the [Firefox Add-ons Store](https://addons.mozilla.org/) (Coming soon)
2. Search for "PrivacyLens Fiverr"
3. Click "Add to Firefox"

### Manual Installation (Temporary)

1. Download this folder
2. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on..."
4. Select any file in this folder (like manifest.json)
5. The addon should now appear in your browser toolbar

### For Development

To create a packaged version:
1. Zip the contents of this folder
2. Rename the zip file to have a `.xpi` extension
3. You can then submit this to the Firefox Add-ons store or install it manually

## How to Use

1. Click the PrivacyLens icon in your browser toolbar while on Fiverr
2. Toggle the switches to enable/disable hiding of:
   - Financial Information
   - Usernames
3. Changes take effect immediately without refreshing the page
4. Hover over any blurred element to temporarily reveal its content (WIP)
5. Click the theme toggle button to switch between light and dark mode

## Privacy & Permissions

- PrivacyLens works entirely client-side and does not collect or transmit any data
- Required permissions:
  - `activeTab`: To interact with Fiverr pages
  - `storage`: To remember your settings between sessions

## Troubleshooting

- **Addon not working?** Try refreshing the page
- **Missing some elements?** The addon periodically scans for new content, but some dynamically loaded elements might take a moment to be detected

## Firefox-Specific Notes

This is the Firefox port of the original Chrome extension. It has been adapted to work with Firefox's WebExtensions API.

---

<div align="center">
  <p>Built by VibeCoding with GitHub Copilot + Claude 3.7 Sonnet</p>
</div> 