import { store } from './store';

export function addTradeRegion(tradeRegion, countryList) {
  store.dispatch({
    type: 'ADD_TRADE_REGION',
    tradeRegion,
    countryList,
  });
}

store.subscribe(() => {
  const state = store.getState();
  if (state.eu && state.nafta && state.asean) {
    invalidateTradeRegionBooleans();
    sortAllCountries(state.countries);
  }
});

function invalidateTradeRegionBooleans() {
  store.dispatch({
    type: 'INVALIDATE_TRADE_REGION_BOOLEANS',
  });
}

function sortAllCountries(countries) {
  const masterList = {};
  const entryList = [];

  countries.forEach(country => {
    const { region, subregion, name, alpha2Code } = country;
    const isChecked = false;
    const isIndeterminate = false;

    let regionObj = masterList[region];
    if (!regionObj) {
      regionObj = { name: region, children: [], isChecked, isIndeterminate };
      entryList.push(region);
      masterList[region] = regionObj;
    }

    let subregionObj = masterList[subregion];
    if (!subregionObj) {
      subregionObj = { name: subregion, parent: region, children: [], isChecked, isIndeterminate };
      regionObj.children.push(subregion);
      masterList[subregion] = subregionObj;
    }

    let countryObj = masterList[name];
    if (!countryObj) {
      countryObj = { name, parent: subregion, isChecked, alpha2Code };
      subregionObj.children.push(name);
      masterList[name] = countryObj;
    }
  });

  store.dispatch({
    type: 'ADD_MASTER_LIST',
    masterList,
    entryList,
  });
}

export function checkItem(itemName, parentList) {
  return store.dispatch({
    type: 'CHECK_ITEM',
    itemName,
  });
}

function activate(actionName) {
  deactivateAllActions();
  store.dispatch({
    type: 'ACTIVATE_ACTION',
    actionName,
  });
}

export function activateSpinner() {
  activate('spinner');
}

export function activateSuccess() {
  activate('success');
}

export function activateError() {
  activate('error');
}

export function deactivateAllActions() {
  store.dispatch({
    type: 'DEACTIVATE_ALL_ACTIONS',
  });
}
