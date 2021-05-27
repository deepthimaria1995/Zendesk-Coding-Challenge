import { createbtnSubmitLayout, createSubscription } from './subscription.js';
import { PLAN_COSTS, PLAN_NAMES } from './planDetails.js';
import {
  showElement,
  hideElement,
  disableButton,
  closePopup,
} from './utilityHelper.js';

var prevSubscription;
var storedCost;

var storedSubscription = {
  plan: 'good',
  name: 'Good',
  seats: 5,
  cost: 50,
};

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

var plans, seats, costs, btnSubmit;

var divLoadPage = document.getElementById('load-page');
var divConfigPage = document.getElementById('config-page');
var divDonePage = document.getElementById('done-page');
var divError = document.getElementById('error');

var btnBack = document.getElementById('back');

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
  divConfigPage.appendChild(createSubscription());
  divConfigPage.appendChild(createbtnSubmitLayout());
  getDOMElements();
  addListenersToElements();
}

/* Function to get the DOM elements*/
function getDOMElements() {
  plans = document.getElementById('plan-input');
  seats = document.getElementById('seats-input');
  costs = document.getElementById('cost-value');
  btnSubmit = document.getElementById('submit');
}

/* Binds DOM elements with event listeners and its callbacks */
function addListenersToElements() {
  plans.addEventListener('change', showSubscriptionPreview);

  seats.addEventListener('change', showSubscriptionPreview);

  btnSubmit.addEventListener('click', update);

  btnBack.addEventListener('click', goBack);

  btnerrorClose.addEventListener('click', function () {
    closePopup(this);
  });
}

/* Function to initialise the subscription plan */
function init() {
  console.debug('$$$ Setting default values for the subscription plan');
  plans.value = storedSubscription.plan;
  seats.value = storedSubscription.seats;
  costs.textContent = storedSubscription.cost;
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

/* Function to show the Done page with the current and update plans */
function updateDone(response) {
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
}

/* Implementation of Update Subscription button */
function update() {
  console.debug('$$$ Showing details of the subscription update');
  hideElement(divLoadPage);
  showElement(divConfigPage);

  $.ajax({
    type: 'put',
    url: '/api/current',
    data: {
      plan: plans.value,
      seats: seats.value,
    },
  }).then((response) => updateDone(response));
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
