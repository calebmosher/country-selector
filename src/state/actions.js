import { store } from './store';
import getItemByName from '../util/get-item-by-name';

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
  const regions = [];
  const ietfMap = {};

  countries.forEach(country => {
    const { region, subregion, name } = country;

    let regionObj = getItemByName(region, regions);
    if (!regionObj) {
      regionObj = { name: region, children: [], countryNames: [] };
      regions.push(regionObj);
    }

    let subregionObj = getItemByName(subregion, regionObj.children);
    if (!subregionObj) {
      subregionObj = { name: subregion, children: [], countryNames: [] };
      regionObj.children.push(subregionObj);
    }

    const countryObj = getItemByName(name, subregionObj.children);
    if (!countryObj) {
      regionObj.countryNames.push(country.name);
      subregionObj.countryNames.push(country.name);
      subregionObj.children.push(country);
      ietfMap[country.name] = country.alpha2Code;
    }
  });

  store.dispatch({
    type: 'ADD_ALL_REGIONS',
    regions,
    ietfMap,
  });
}

export function checkItem(itemName, parentList) {
  switch (parentList.length) {
    case 2:
      return store.dispatch({
        type: 'CHECK_ITEM_COUNTRY',
        itemName,
        parentList,
      });
    case 1:
      return store.dispatch({
        type: 'CHECK_ITEM_SUBREGION',
        itemName,
        parentList,
      });
    case 0:
      return store.dispatch({
        type: 'CHECK_ITEM_REGION',
        itemName,
      });
  }
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
