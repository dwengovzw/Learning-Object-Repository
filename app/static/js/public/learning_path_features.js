let LearningpathInteraction = {
  formatLearningObject: (container, callback = () => {}) => {
    LearningpathInteraction.formatSimulatorCode(container);
    callback();
  },
  formatSimulatorCode: (container) => {
    LearningpathInteraction.findDescendantWithClass(container, 'dwengo-code-simulator').forEach(element => {
      LearningpathInteraction.formatCodeElement(element);
    });
  },
  // Function to be executed when the target class element is added
  formatCodeElement: (element) => {
    let codeElement = element.querySelector('code');
    if (!codeElement) {
      console.log("No code element found in simulator element");
      return;
    }
    let filename = element.querySelector("code").getAttribute("data-filename") || 'program.cpp'
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
      form.action = 'http://localhost:12032/openTextualProgram';
      form.target = '_blank'; // Open the result in a new tab

      // Create the input field for the state parameter
      const stateInput = document.createElement('input');
      stateInput.type = 'hidden';
      stateInput.name = 'state';
      stateInput.value = JSON.stringify({
        code: codeElement.textContent.trim(),
        filename: filename
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
  },
  findDescendantWithClass: (element, className) => {
    // Check if the current element has the specified class
    if (element.classList.contains(className)) {
        return [element];
    }

    // Check each child element recursively
    let decendantsWithClass = []
    for (let i = 0; i < element.children.length; i++) {
        decendantsWithClass = [...decendantsWithClass, ...LearningpathInteraction.findDescendantWithClass(element.children[i], className)]
    }
    return decendantsWithClass
}
}


