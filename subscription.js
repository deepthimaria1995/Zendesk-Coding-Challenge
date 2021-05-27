import { PLAN_NAMES } from './PlanDetails.js';

/* Function to create the user input UI for subscription plan */
export function createPlanInput(plans_arr){
  let parentDiv = document.createElement('div');
  let selectList = document.createElement('select');
  selectList.id = 'plan-input';
  parentDiv.appendChild(selectList);

  for (var key in plans_arr) {
    let option = document.createElement('option');
    option.value = key;
    option.text = plans_arr[key];
    selectList.appendChild(option);
  }
  return parentDiv;
};

/* Function to create the label element for subscription plan */
export function createPlanLabel(){
  let parentDiv = document.createElement('div');
  parentDiv.className = 'label';
  let label = document.createElement('Label');
  label.setAttribute('for', 'planInput');
  label.innerHTML = 'Plan';
  parentDiv.appendChild(label);
  return parentDiv;
};

/* Function to return subscription plan div*/
export function createPlanLayout(){
  let parentDiv = document.createElement('div');
  parentDiv.className = 'edit-plan';
  parentDiv.appendChild(createPlanInput(PLAN_NAMES));
  parentDiv.appendChild(createPlanLabel());
  return parentDiv;
};

/* Function to create the user input UI for subscription seats */
export function createSeatsInput(){
  let parentDiv = document.createElement('div');
  let input = document.createElement('input');
  input.id = 'seats-input';
  input.type = 'text';
  input.value = '';
  parentDiv.appendChild(input);
  return parentDiv;
};

/* Function to create the label element for subscription seats */
export function createSeatsLabel(){
  let parentDiv = document.createElement('div');
  parentDiv.className = 'label';
  let label = document.createElement('Label');
  label.setAttribute('for', 'seats-input');
  label.innerHTML = 'Seats';
  parentDiv.appendChild(label);
  return parentDiv;
};

/* Function to return subscription seats div */
export function createSeatLayout(){
  let parentDiv = document.createElement('div');
  parentDiv.className = 'edit-seats';

  parentDiv.appendChild(createSeatsInput());
  parentDiv.appendChild(createSeatsLabel());
  return parentDiv;
};

/* Function to create the user input UI for subscription price */
export function createPriceInput(){
  let parentDiv = document.createElement('div');
  parentDiv.id = 'cost-value';
  return parentDiv;
};

/* Function to create the label element for subscription price*/
export function createPriceLabel(){
  let parentDiv = document.createElement('div');
  parentDiv.className = 'label';
  parentDiv.innerHTML = 'Price';
  return parentDiv;
};

/* Function to return subscription price div */
export function createPriceLayout() {
  let parentDiv = document.createElement('div');
  parentDiv.className = 'price';

  parentDiv.appendChild(createPriceInput());
  parentDiv.appendChild(createPriceLabel());
  return parentDiv;
};

/* Function to create a new subscription layout */
export function createSubscription() {
  let parentDiv = document.createElement('div');
  parentDiv.className = 'product';
  parentDiv.appendChild(createPlanLayout());
  parentDiv.appendChild(createSeatLayout());
  parentDiv.appendChild(createPriceLayout());
  return parentDiv;
};