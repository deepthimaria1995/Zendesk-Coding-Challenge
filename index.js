var PLAN_COSTS = {
  basic: 1,
  good: 10,
  better: 100,
  best: 1000,
};

var PLAN_NAMES = {
  basic: 'Basic',
  good: 'Good',
  better: 'Better',
  best: 'Best',
};

var storedSubscription = {
  plan: 'good',
  name: 'Good',
  seats: 5,
  cost: 50,
};

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

var plans = document.getElementById('plan-input');
var seats = document.getElementById('seats-input');
var costs = document.getElementById('cost-value');

var btnSubmit = document.getElementById('submit');
var btnBack = document.getElementById('back');

var newplan = document.getElementById('new-plan');
var newseats = document.getElementById('new-seats');
var newcost = document.getElementById('new-cost');
var oldplan = document.getElementById('old-plan');
var oldseats = document.getElementById('old-seats');
var oldcost = document.getElementById('old-cost');
var btnerrorClose = document.getElementById('errorclosebtn');

/* Function to show an HTML tag using ID
elementId : ID of the HTML tag */
showElement = (elementId) => {
  console.debug('Showing element ' + elementId.id);
  if (elementId) elementId.style.display = 'block';
};

/* Function to hide an HTML tag using ID
elementId : ID of the HTML tag */
hideElement = (elementId) => {
  console.debug('Hiding element ' + elementId.id);
  if (elementId) elementId.style.display = 'none';
};

/* Function to disable/enable a button given its ID
btnId : ID of the button
isDisable : (boolean) true -> disable, false -> enable */
disableButton = (btnId, isDisable) => {
  if (btnId && isDisable !== null) {
    btnId.disabled = isDisable;
  }
};

/* Function to implement close button on the pop up */
closePopup = (ele) => {
  var div = ele.parentElement;
  div.style.opacity = '0';
  setTimeout(function () {
    div.style.display = 'none';
  }, 600);
};

/* Function to initialise the subscription plan */
init = () => {
  console.log('init() called');
  plans.value = storedSubscription.plan;
  seats.value = storedSubscription.seats;
  costs.textContent = storedSubscription.cost;
};

/* Function to update the plan in config page */
updateValues = (data) => {
  plans.value = data.plan;
  seats.value = data.seats;
  costs.textContent = '$' + data.cost;
};

/* Function which calls API to get the updated plan values */
showSubscriptionPreview = () => {
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
};

/* Implementation of Update Subscription button */
update = () => {
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
    newplan.classList.add("updated");
    newcost.classList.add("updated");
    newseats.classList.add("updated");

    oldplan.textContent = prevSubscription.name;
    oldseats.textContent = prevSubscription.seats;
    oldcost.textContent = '$' + prevSubscription.cost;

    newplan.textContent = response.name;
    newseats.textContent = response.seats;
    newcost.textContent = '$' + response.cost;

    if (response.name !== prevSubscription.name) {
      newplan.classList.add("updated");
    }
    if (response.seats !== prevSubscription.seats) {
      newseats.classList.add("updated");
    }
    if (response.cost !== prevSubscription.cost) {
      newcost.classList.add("updated");
    }

    hideElement(divLoadPage);
    hideElement(divConfigPage);
    showElement(divDonePage);

    storedCost = response.cost;
    disableButton(btnSubmit, true);
  });
};

/* Implementation of Back button */
goBack = () => {
  hideElement(divDonePage);
  showElement(divConfigPage);
};

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
