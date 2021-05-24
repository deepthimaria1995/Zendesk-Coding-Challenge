import { createSubscription } from './subscription.js';
import { PLAN_COSTS, PLAN_NAMES, storedSubscription } from './planDetails.js';

var prevSubscription;
var storedCost;

/*****************************
  
  Mock server code BEGIN
  
*****************************/

$.mockjax({
  url: '/api/current',
  type: 'get',
  responseText: storedSubscription,
});

$.mockjax({
  url: '/api/current',
  type: 'put',
  responseDelay: 1000,
  response: function (settings) {
    var newData = {
      plan: settings.data.plan,
      name: PLAN_NAMES[settings.data.plan],
      seats: settings.data.seats,
      cost: settings.data.seats * PLAN_COSTS[settings.data.plan],
    };
    prevSubscription = storedSubscription;
    storedSubscription = newData;
    this.responseText = newData;
  },
});

$.mockjax({
  url: '/api/preview',
  responseDelay: 1000,
  response: function (settings) {
    this.responseText = {
      plan: settings.data.plan,
      name: PLAN_NAMES[settings.data.plan],
      seats: settings.data.seats,
      cost: settings.data.seats * PLAN_COSTS[settings.data.plan],
    };
  },
});

/*****************************
  
  Mock server code END

*****************************/

var divLoadPage = document.getElementById('load-page');
var divConfigPage = document.getElementById('config-page');
var divDonePage = document.getElementById('done-page');
var divError = document.getElementById('error');

var btnSubmit = document.getElementById('submit');
var btnBack = document.getElementById('back');

var plans, seats, costs;

var newplan = document.getElementById('new-plan');
var newseats = document.getElementById('new-seats');
var newcost = document.getElementById('new-cost');
var oldplan = document.getElementById('old-plan');
var oldseats = document.getElementById('old-seats');
var oldcost = document.getElementById('old-cost');
var btnerrorClose = document.getElementById('errorclosebtn');

/* Function to add the required subscription plans for required products */
function loadPage() {
  console.debug('$$$ Loading page with the subscription plans');
  var divLoadPage = document.getElementById('load-page');
  var btnSubmitComponent = document.getElementsByClassName(
    'confirm-page-button-section'
  )[0];
  divConfigPage.insertBefore(createSubscription(), btnSubmitComponent);
  getDOMElements();
}

/* Function to get the DOM elements*/
function getDOMElements(){
  plans = document.getElementById('plan-input');
  seats = document.getElementById('seats-input');
  costs = document.getElementById('cost-value');
}

/* Function to initialise the subscription plan */
function init() {
  console.debug('$$$ Setting default values for the subscription plan');
  plans.value = storedSubscription.plan;
  seats.value = storedSubscription.seats;
  costs.textContent = storedSubscription.cost;
}

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

/* Function to update the plan in config page */
function updateValues(data) {
  plans.value = data.plan;
  seats.value = data.seats;
  costs.textContent = '$' + data.cost;
}

/* Function which calls API to get the updated plan values */
function showSubscriptionPreview() {
  costs.innerHTML = '-';
  if (!isNaN(seats.value) && seats.value > 0) {
    hideElement(divError);
    $.post({
      url: '/api/preview',
      data: {
        plan: plans.value,
        seats: seats.value,
      },
    }).then(function (response) {
      updateValues(response);
      if (response.cost === storedCost) {
        disableButton(btnSubmit, true);
      } else {
        disableButton(btnSubmit, false);
      }
    });
  } else {
    showElement(divError);
    disableButton(btnSubmit, true);
  }
}

/* Implementation of Update Subscription button */
function update() {
  console.debug("$$$ Showing details of the subscription update");
  hideElement(divLoadPage);
  showElement(divConfigPage);

  $.ajax({
    type: 'put',
    url: '/api/current',
    data: {
      plan: plans.value,
      seats: seats.value,
    },
  }).then(function updateDone(response) {
    newplan.classList.add('updated');
    newcost.classList.add('updated');
    newseats.classList.add('updated');

    oldplan.textContent = prevSubscription.name;
    oldseats.textContent = prevSubscription.seats;
    oldcost.textContent = '$' + prevSubscription.cost;

    newplan.textContent = response.name;
    newseats.textContent = response.seats;
    newcost.textContent = '$' + response.cost;

    if (response.name !== prevSubscription.name) {
      newplan.classList.add('updated');
    }
    if (response.seats !== prevSubscription.seats) {
      newseats.classList.add('updated');
    }
    if (response.cost !== prevSubscription.cost) {
      newcost.classList.add('updated');
    }

    hideElement(divLoadPage);
    hideElement(divConfigPage);
    showElement(divDonePage);

    storedCost = response.cost;
    disableButton(btnSubmit, true);
  });
}

/* Implementation of Back button */
function goBack() {
  hideElement(divDonePage);
  showElement(divConfigPage);
}

loadPage();

showElement(divLoadPage);
hideElement(divConfigPage);
hideElement(divDonePage);

init();

$.get({
  url: '/api/current',
}).then(function success(response) {
  hideElement(divLoadPage);
  showElement(divConfigPage);

  updateValues(response);
  storedCost = response.cost;
});

plans.addEventListener('change', showSubscriptionPreview);

seats.addEventListener('change', showSubscriptionPreview);

btnSubmit.addEventListener('click', update);

btnBack.addEventListener('click', goBack);

btnerrorClose.addEventListener('click', function () {
  closePopup(this);
});
