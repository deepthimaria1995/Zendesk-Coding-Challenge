/* Function to show an HTML tag using ID
elementId : ID of the HTML tag */
function showElement(elementId) {
  console.debug('$$$ Showing element ' + elementId.id);
  if (elementId) elementId.style.display = 'block';
}

/* Function to hide an HTML tag using ID
elementId : ID of the HTML tag */
function hideElement(elementId) {
  console.debug('$$$ Hiding element ' + elementId.id);
  if (elementId) elementId.style.display = 'none';
}

/* Function to disable/enable a button given its ID
btnId : ID of the button
isDisable : (boolean) true -> disable, false -> enable */
function disableButton(btnId, isDisable) {
  if (btnId && isDisable !== null) {
    btnId.disabled = isDisable;
  }
}

/* Function to implement close button on the pop up */
function closePopup(ele) {
  var div = ele.parentElement;
  div.style.opacity = '0';
  setTimeout(function () {
    div.style.display = 'none';
  }, 600);
}

function showErrorMessage(msg) {
  var errorMsg = document.getElementById("error");
  errorMsg.innerHTML = "<strong>Error!</strong> " + msg;
  showElement(errorMsg);
}

export { showElement, hideElement, disableButton, closePopup, showErrorMessage }