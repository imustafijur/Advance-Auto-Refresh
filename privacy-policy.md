# Privacy Policy for Advance Auto Refresh

**Effective Date:** October 2, 2025

This Privacy Policy describes the privacy practices for the "Advance Auto Refresh" Chrome extension (the "Extension") created by Mustafijur Rahman. We are committed to protecting your privacy. This policy explains what information the Extension handles and why certain permissions are required to provide its functionality.

### **Core Principle: We Do Not Collect Your Data**

**We want to be crystal clear: Advance Auto Refresh does not collect, store, transmit, or sell any of your personal information or browsing data.**

The entire function of the Extension runs locally on your computer. Your settings and activity are yours alone and are never sent to our servers or any third-party service.

### **Information Handled by the Extension**

The Extension needs to save your settings to function correctly. This information is handled as follows:

* **User-Configured Settings**: This includes the URLs you want to refresh, the time intervals you set, the operation mode (Classic/Advanced), and any other custom settings you configure. This data is saved using the standard `chrome.storage` API, which means it is stored **only on your local computer**. It is never accessed by us or transmitted anywhere.

### **Why Does the Extension Need These Permissions?**

To provide its powerful features, Advance Auto Refresh requires certain permissions. Here is a breakdown of what each permission does, in plain English:

* **`storage`**:
    * **Purpose**: To save your settings locally on your browser.
    * **In Practice**: This allows the extension to remember your list of URLs and timer settings when you close and reopen your browser, so you don't have to set it up every time.

* **`tabs`**:
    * **Purpose**: To access and interact with your tabs.
    * **In Practice**: This is necessary to find the specific tabs that match the URLs you've configured. It allows the Extension to perform the refresh, navigate to a new page (for the Random Pool feature), or execute a click on the correct tab.

* **`alarms`**:
    * **Purpose**: To schedule tasks to run at a specific time.
    * **In Practice**: Instead of constantly checking the time, the Extension uses the efficient `alarms` API to tell Chrome "wake me up in X seconds to perform the next refresh." This saves your computer's resources.

* **`scripting`**:
    * **Purpose**: To execute code on a specific webpage.
    * **In Practice**: This permission is required **only** for the "Click Path Automation" feature. It allows the Extension to run a script on a page to find and click the specific link you have configured. This permission is not used for any other purpose.

* **`host_permissions: ["<all_urls>"]`**:
    * **Purpose**: To allow the `scripting` permission to run on any website the user chooses.
    * **In Practice**: This permission sounds broad, but it is necessary because we do not know in advance which websites **you** will want to refresh or automate. This permission allows the Extension to function on any website you configure, such as `http://example.com` or `https://anothersite.org`. The Extension is completely inactive on pages you have not specifically configured.

### **Third-Party Services**

Advance Auto Refresh does not use any third-party analytics, advertising, or data collection services.

### **Changes to This Privacy Policy**

We may update this Privacy Policy in the future if the Extension's functionality changes. We will notify you of any significant changes by updating the version of the Extension and its description in the Chrome Web Store.

### **Contact Us**

If you have any questions or concerns about this Privacy Policy, please contact us.
