# Advance Auto Refresh
### by Mustafijur Rahman

Welcome to Advance Auto Refresh, the most powerful and user-friendly tool to automatically refresh your browser tabs. Whether you need to monitor a webpage for changes, cycle through dashboards, or automate simple navigation, this extension has you covered with a beautiful and intuitive interface.

![Extension Popup Interface](icons/Screenshot.png)

## Table of Contents

-   [Key Features](#key-features)
-   [How to Use Advance Auto Refresh](#how-to-use-advance-auto-refresh)
    -   [Enabling the Extension](#enabling-the-extension)
    -   [Choosing Your Operation Mode](#choosing-your-operation-mode)
    -   [Using Classic Mode (Simple Refreshing)](#using-classic-mode-simple-refreshing)
    -   [Using Advanced Mode (Powerful Automation)](#using-advanced-mode-powerful-automation)
-   [License](#license)
-   [Copyright](#copyright)

## Key Features

-   **Two Powerful Modes**: Choose between a simple **Classic Mode** for quickly refreshing a list of sites, or an **Advanced Mode** for customizing the behavior of each URL individually.
-   **Randomized Intervals**: Make your refreshes look more natural by setting a minimum and maximum time. The extension will pick a random interval within that range for each refresh.
-   **Three Unique Actions**: Go beyond simple reloading!
    -   **Standard Reload**: The classic page refresh.
    -   **Random URL Pool**: Provide a list of URLs and the extension will cycle through them, navigating to a new random one from your list at each interval.
    -   **Click Path Automation**: Tell the extension to automatically click a specific link on a page for you. Perfect for navigating through image galleries, forum pages, or auction listings.
-   **Smart Behavior Controls**:
    -   **Pause When Active**: To save resources and prevent interruptions, the extension can automatically pause its timer for a tab while you are actively viewing it.
    -   **Pinned Tab Only**: Restrict the extension to only work on tabs you have pinned.
    -   **Auto-Pinning**: Automatically pin a tab as soon as it matches one of your target URLs in Advanced Mode.
-   **Scheduling and Limits**:
    -   **Daily Action Limit**: Set a maximum number of total refreshes or actions per day to stay in control.
    -   **Active Hours**: Define a schedule (e.g., from 9:00 AM to 5:00 PM) so the extension only runs when you need it to.
-   **Helpful Statistics**: See how much work the extension is doing for you with a clean display of today's total actions, the number of active URLs, and the total time the extension has been running.

## How to Use Advance Auto Refresh

We are excited to announce that **Advance Auto Refresh** is now available on the **Chrome Web Store**! If you enjoy using the extension, help us spread the word and promote it to others.

**[Download Advance Auto Refresh from the Chrome Web Store](https://chromewebstore.google.com/detail/advance-auto-refresh/hdendciklgimifhmgikbonnkbhcpniaj)**

Leave a review, share your feedback, and help others discover how this powerful tool can boost productivity and simplify their browsing experience!

### Enabling the Extension

At the very top of the popup, you will see a large toggle switch.
-   **Click the toggle** to turn the extension on or off globally.
-   When enabled, the extension will start its timers. When disabled, all activity will stop.
-   You can see the extension's status (Enabled, Disabled, or time to next refresh) in the badge on the top right.

### Choosing Your Operation Mode

The extension has two modes. You can switch between them at any time.

1.  **Classic Refresh**: Best for when you want to refresh one or more tabs using the same time interval. It's quick and simple.
2.  **Advanced Refresh**: Best for when you need more control. Use this if you want different timers for different websites, or if you want to use advanced features like the Random URL Pool or Click Path.

### Using Classic Mode (Simple Refreshing)

1.  **Select "Classic Refresh"** from the Operation Mode selector.
2.  **Add Target URLs**: In the "Target URLs" box, type or paste the web addresses you want to refresh. You can add multiple URLs, just put each one on a new line. You can also click the `+ Add Current` button to automatically add the URL of the tab you are currently viewing.
3.  **Set Refresh Intervals**: In the "Refresh Intervals" section, enter the minimum and maximum time in seconds. The extension will refresh your pages at a random time between these two values.
4.  **Set Pin Options (Optional)**: If you only want the extension to refresh tabs that are pinned, check the box for "Only affect pinned tabs".
5.  **Click "Save Settings"**.

### Using Advanced Mode (Powerful Automation)

Advanced mode is organized by "URL Cards". Each card contains the settings for one specific website or task.

1.  **Select "Advanced Refresh"** from the Operation Mode selector.
2.  **Add a URL Card**: Click the `+ Add New URL` button to create a blank card, or click `+ Add Current` to create a card pre-filled with the URL of your current tab.
3.  **Configure the Card**:
    -   **URL**: Enter the starting URL for your task.
    -   **Intervals**: Set the Min and Max refresh time (in seconds) specifically for this card.
    -   **Status Toggle**: You can pause or activate each card individually using the toggle on the right. This is great for temporarily disabling one task without affecting others.
4.  **Choose an Action**: This is where the magic happens. On each card, you can choose between a simple reload, a Random Pool, or a Click Path. You can only have one active at a time for each card.
    -   **To Use Random URL Pool**:
        -   Click the dice icon (🎲). It will become active.
        -   A text box will appear. Enter a list of URLs (one per line) that you want the extension to cycle through.
        -   At each interval, the extension will navigate the tab to one of the URLs from this list.
    -   **To Use Click Path Automation**:
        -   Click the map icon (🗺️). It will become active.
        -   A text box will appear. Here, you enter the URL of the link(s) you want the extension to click.
        -   For example, if you are on `example.com/page1` and you want to click a link that goes to `example.com/page2`, you would put `example.com/page2` in the text box. The extension will find the link on the page and click it for you.
5.  **Set Global Settings**: In the sections below the URL cards, you can control the overall behavior.
    -   **Behavior Settings**: Check "Pause when tab is active" if you don't want the timer to run while you're using the tab.
    -   **Advanced Pin Options**: Choose if you want to only affect pinned tabs, auto-pin new tabs, or unpin tabs when the extension is disabled.
    -   **Global Limits & Schedule**: Enable and configure daily limits or active hours for all your advanced tasks.
6.  **Click "Save Settings"** to apply all your changes.

## License

This is a free and open-source extension. You are free to use, modify, and distribute it under the terms of the MIT public license.


## ©️ Copyright

<p>All copyrights reserved © 2025 – <a href="https://mustafijur.org/">Mustafijur Rahman</a> CEO and Founder of <a target="_blank" href="https://www.soovex.com/">Soovex IT Agency</a></p>
