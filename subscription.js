var PLAN_NAMES = {
  basic: "Basic",
  good: "Good",
  better: "Better",
  best: "Best",
};

export function createPlanInput(plans_arr){
  let parentDiv = document.createElement('div');
  //Create and append select list
  let selectList = document.createElement('select');
  selectList.id = 'plan-input';
  parentDiv.appendChild(selectList);

  //Create and append the options
  for (var key in plans_arr) {
    let option = document.createElement('option');
    option.value = key;
    option.text = plans_arr[key];
    selectList.appendChild(option);
  }
  return parentDiv;
};

export function createPlanLabel(){
  let parentDiv = document.createElement('div');
  parentDiv.className = 'label';
  let label = document.createElement('Label');
  label.setAttribute('for', 'planInput');
  label.innerHTML = 'Plan';
  parentDiv.appendChild(label);
  return parentDiv;
};

export function createPlanLayout(){
  let parentDiv = document.createElement('div');
  parentDiv.className = 'edit-plan';
  parentDiv.appendChild(createPlanInput(PLAN_NAMES));
  parentDiv.appendChild(createPlanLabel());
  return parentDiv;
};

export function createSeatsInput(){
  let parentDiv = document.createElement('div');
  let input = document.createElement('input');
  input.id = 'seats-input';
  input.type = 'text';
  input.value = '';
  parentDiv.appendChild(input);
  return parentDiv;
};

export function createSeatsLabel(){
  let parentDiv = document.createElement('div');
  parentDiv.className = 'label';
  let label = document.createElement('Label');
  label.setAttribute('for', 'seats-input');
  label.innerHTML = 'Seats';
  parentDiv.appendChild(label);
  return parentDiv;
};

export function createSeatLayout(){
  let parentDiv = document.createElement('div');
  parentDiv.className = 'edit-seats';

  parentDiv.appendChild(createSeatsInput());
  parentDiv.appendChild(createSeatsLabel());
  return parentDiv;
};

export function createPriceInput(){
  let parentDiv = document.createElement('div');
  parentDiv.id = 'cost-value';
  return parentDiv;
};

export function createPriceLabel(){
  let parentDiv = document.createElement('div');
  parentDiv.className = 'label';
  parentDiv.innerHTML = 'Price';
  return parentDiv;
};

export function createPriceLayout() {
//createPriceLayout = () => {
  let parentDiv = document.createElement('div');
  parentDiv.className = 'price';

  parentDiv.appendChild(createPriceInput());
  parentDiv.appendChild(createPriceLabel());
  return parentDiv;
};

export function createSubscription() {
//createSubscription = () => {
  let parentDiv = document.createElement('div');
  parentDiv.className = 'product';
  parentDiv.appendChild(createPlanLayout());
  parentDiv.appendChild(createSeatLayout());
  parentDiv.appendChild(createPriceLayout());
  console.log(parentDiv);
  return parentDiv;
};

/* module.exports = {
  createSubscription : createSubscription,
  createPriceLayout : createPriceLayout
} */