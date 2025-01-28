'use strict'
// Write your module here
// It must send an event "frames:loaded" from the top frame containing a list of { name:label } pairs,
// which describes all the fields in each frame.

// This is a template to help you get started, feel free to make your own solution.
function execute() {
	try {
    // Step 1 Scrape Fields and Create Fields list object.

    const fields = [];

    const formControls = document.querySelectorAll('input, select, textarea, button');

    formControls.forEach(control => {
       //Fetch the name attribute
       const name = control.name || '';
       let label = '';
       
       //Fetch the label if existed
       if (control.labels && control.labels.length > 0)
         label = control.labels[0].innerText.trim();
       
       //only add if it has a valid name and label
         if (name && label) {
           fields.push({ [name]: label});
         }
    });

    let receivedFrames = 0; // Count of frames that have sent their data

    // Step 2 Add Listener for Top Frame to Receive Fields.
    if (isTopFrame()) {
      window.addEventListener('message', (event) => {

        //Ensure the message is from a trusted source
        if (event.data && event.data.type === 'fields') {
          const newFields = event.data.fields;

          // - Merge fields from frames and avoid duplicates
          newFields.forEach(newField => {
            if (!fields.some(field => Object.keys(field)[0] === Object.keys(newField)[0])) {
              fields.push(newField);
            }
        })
      }
      let totalFrames = getAllFrames().length; // Get total number of frames
      receivedFrames++;

        // - Process Fields and send event once all fields are collected.
        if (receivedFrames === totalFrames) {
              // Sort fields alphabetically by name
              fields.sort((a, b) => {
                const nameA = Object.keys(a)[0];
                const nameB = Object.keys(b)[0];
                return nameA.localeCompare(nameB);
        });

        // Create the CustomEvent with the name 'frames:loaded'
        const framesLoadedEvent = new CustomEvent('frames:loaded', {
            detail: { fields }  // Include fields in the detail
        });
        document.dispatchEvent(framesLoadedEvent);

        }
      });
    } else if (!isTopFrame()) {
        // Child frames sends Fields up to Top Frame.    
        getTopFrame().postMessage({ type: 'fields', fields: fields }, '*'); 
    }
	} catch (e) {
		console.error(e)
	}
}

execute();

// Utility functions to check and get the top frame
// as Karma test framework changes top & context frames.
// Use this instead of "window.top".
function getTopFrame() {
  return window.top.frames[0];
}

function isTopFrame() {
  return window.location.pathname == '/context.html';
}

function getAllFrames() {
  // Get all frames in the document
  return [window].concat(Array.from(window.frames));
}