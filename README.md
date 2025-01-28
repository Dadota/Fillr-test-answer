# Fillr JS Engineer Code Test
This JavaScript module collects the names and labels of form controls (input, select, textarea, button) from multiple frames (top frame and iframes) and dispatches a frames:loaded event in the top frame with the collected data.

Features:
Collects form field names and labels from the top frame and all iframes.
Merges and avoids duplicates.
Sorts fields alphabetically by name.
Dispatches a frames:loaded event with the collected fields once all frames have sent their data.

How It Works:
Each iframe collects form fields and sends them to the top frame using postMessage.
The top frame listens for messages, merges the fields, and triggers the frames:loaded event once all frames have sent their data.
