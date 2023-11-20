function setupDOMUpdateObserver(){
  // Function to be executed when the target class element is added
  function onElementAdded(element) {
    console.log('Element with the specified class name added!');
    // Your custom code here
    console.log(element.textContent);

    // Create a link element
    const link = document.createElement('a');
    link.textContent = 'Simulator';
    link.classList.add('btn');
    link.classList.add('simulator');
    link.classList.add('dwengo-editor-button');

    // Add click event listener to the link
    link.addEventListener('click', () => {
      // Create a form element
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://blockly.dwengo.org/openState';
      form.target = '_blank'; // Open the result in a new tab

      // Create the input field for the state parameter
      const stateInput = document.createElement('input');
      stateInput.type = 'hidden';
      stateInput.name = 'state';
      stateInput.value = JSON.stringify({
        view: 'text',
        cppCode: [element.textContent],
        scenario: 'spyrograph'
      });

      // Append the input field to the form
      form.appendChild(stateInput);

      // Append the form to the document body
      document.body.appendChild(form);

      // Submit the form
      form.submit();

      // Remove the form from the document body
      document.body.removeChild(form);
    });

    // Append the link to the bottom of the element
    element.appendChild(link);
  }

  // Target element class name to observe
  const targetClassName = 'dwengo-code-simulator';

  // Function to check for existing elements with the target class during the initial load
  function checkExistingElements() {
    const elements = document.querySelectorAll(`.${targetClassName}`);
    elements.forEach(element => {
      // Execute your function for each existing element
      onElementAdded(element);
    });
  }

  // Select the target node
  const targetNode = document.body; // You can specify another target element if needed

  // Options for the observer (specify the type of mutations to observe)
  const config = { childList: true, subtree: true, attributes: false, characterData: false };

  // Check for existing elements during the initial load
  checkExistingElements();

  // Create a MutationObserver instance
  const observer = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        // Check if the added node has the target class name
        const addedNodes = Array.from(mutation.addedNodes);
        const hasTargetClass = addedNodes.some(node => node.classList && node.classList.contains(targetClassName));

        if (hasTargetClass) {
          const addedNode = addedNodes.find(node => node.classList && node.classList.contains(targetClassName));
          // Execute your function when an element with the target class is added
          onElementAdded(addedNode);
        }
      }
    }
  });

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);

  // Later, you can disconnect the observer when it's no longer needed
  // observer.disconnect();
}

// Event listener to execute when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('Document loaded!');
  setupDOMUpdateObserver();
});
