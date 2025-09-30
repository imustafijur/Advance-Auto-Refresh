# Advance Auto Refresh
### by Mustafijur Rahman

An advanced Chrome extension to automatically refresh or navigate tabs using random intervals, with powerful controls for pinned tabs and specific domains.

![Extension Popup Interface](icons/Screenshot.png)

---

## 🌟 Overview

**Advance Auto Refresh** is a powerful browser tool designed for users who need to keep web pages updated or cycle through a list of specific URLs automatically. It goes beyond simple refreshing by offering two distinct modes of operation—**Classic Refresh** and the new **Randomizer Mode**—each with its own set of customizable rules.

Whether you're monitoring dynamic content or automating navigation, this extension provides a flexible and user-friendly solution.

---

## ✨ Features

This extension is packed with features to give you full control over tab behavior:

* **Dual Operation Modes**: Choose between two powerful modes to suit your needs.
    * **Classic Refresh Mode**: Automatically reloads tabs based on a list of URLs you provide. This is perfect for keeping an eye on live dashboards, social media feeds, or news sites.
    * **Randomizer Mode**: Navigates a pinned tab to a random URL from a predefined list. This is ideal for tasks like cycling through different profiles, pages, or content on a single domain.

* **Randomized Intervals**: Instead of a fixed time, you can set a **minimum** and **maximum** interval (in seconds). The extension will pick a random time within that range for each action, making the behavior less predictable.

* **Pinned Tab Targeting**: Both modes have a strong focus on **pinned tabs**.
    * In Classic Refresh mode, you can choose to refresh *only* the pinned tabs that match your URL list.
    * Randomizer mode works **exclusively** on pinned tabs, giving you a dedicated workspace for its operation.

* **Domain & URL Filtering**:
    * In **Classic Refresh** mode, you provide a list of specific URLs to be reloaded.
    * In **Randomizer** mode, you provide a list of **target domains** (e.g., `https://www.facebook.com`) and a separate list of **specific pages** to visit on those domains. The extension will only affect pinned tabs that match one of your target domains.

* **Intuitive UI**: A clean and simple popup allows you to:
    * Easily add or remove target URLs/domains.
    * Add the current tab's domain with a single click.
    * Configure time intervals and modes.
    * Enable or disable the extension globally.

* **Countdown Badge**: The extension icon displays a live countdown timer, showing you exactly when the next refresh or navigation will occur on your currently active tab.

---

## 🚀 How to Use

### Setting Up Classic Refresh Mode

Use this mode to simply reload a list of pages.

1.  Add the full URLs of the pages you want to refresh into the **Target URLs / Domains** list.
2.  Set your desired **Min Interval** and **Max Interval** in seconds.
3.  (Optional) Check the **Only Pinned Tabs** box if you only want pinned tabs to be affected.
4.  Make sure **Enable Randomizer Mode** is turned **off**.
5.  Turn on **Enable Extension** and click **Save Settings**.

### Setting Up Randomizer Mode

Use this mode to visit a random page from a list on a specific, pinned tab.

1.  In the **Target URLs / Domains** list, add the base domain you want to work on (e.g., `https://www.facebook.com`).
2.  Turn **on** the **Enable Randomizer Mode** switch. This will automatically select and lock the "Pinned Tabs only" logic.
3.  In the **Random URL List** text box, paste your full list of specific URLs to visit (one URL per line).
4.  Set your desired **Min Interval** and **Max Interval**.
5.  **Pin** the tab(s) on the target domain (e.g., your Facebook tab). The randomizer will take control of this pinned tab.
6.  Turn on **Enable Extension** and click **Save Settings**. The extension will now randomly navigate the pinned tab to one of the URLs from your list at each interval.

---

## 🛠️ Installation

1.  Download or clone this repository to your local machine.
2.  Open Google Chrome and navigate to `chrome://extensions/`.
3.  Enable **"Developer mode"** using the toggle switch in the top-right corner.
4.  Click on the **"Load unpacked"** button.
5.  Select the directory where you saved the extension files.
6.  The extension is now installed and ready to use!

---

## ©️ Copyright

<p>All copyrights reserved © 2025 – <a href="https://mustafijur.org/">Mustafijur Rahman</a> CEO and Founder of <a target="_blank" href="https://www.soovex.com/">Soovex IT Agency</a></p>
