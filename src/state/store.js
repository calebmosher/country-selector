import { createStore } from 'redux';
import deepMerge from 'deepmerge';
import { tradeRegions } from '../util/trade-regions';
import getItemByName from '../util/get-item-by-name';

export const store = createStore((state = { countries: [], checkedList: [], activeAction: '' }, action) => {
  switch (action.type) {
    case 'INVALIDATE_TRADE_REGION_BOOLEANS':
      return deepMerge(state,
        tradeRegions.reduce((newState, tradeRegion) => Object.assign(newState, { [tradeRegion]: false }, {}))
      );

    case 'ADD_TRADE_REGION':
      return deepMerge(state, {
        [action.tradeRegion]: true,
        countries: state.countries.concat(action.countryList),
      });

    case 'ADD_ALL_REGIONS':
      return deepMerge(state, {
        regions: action.regions,
        ietfMap: action.ietfMap,
      });

    case 'CHECK_ITEM_COUNTRY': {
      const countryCheckedIndex = state.checkedList.indexOf(action.itemName);
      if (countryCheckedIndex === -1) {
        state.checkedList.push(action.itemName);
        return state;
      }
      state.checkedList = state.checkedList.filter(name => name !== action.itemName);
      return state;
    }

    case 'CHECK_ITEM_SUBREGION': {
      const region = getItemByName(action.parentList[0], state.regions);
      const subregion = getItemByName(action.itemName, region.children);
      const isCheckedAny = subregion.countryNames.reduce((isChecked, name) =>
        isChecked || state.checkedList.includes(name), false);

      if (isCheckedAny) {
        state.checkedList = state.checkedList.filter(name => !subregion.countryNames.includes(name));
        return state;
      }
      state.checkedList = state.checkedList.concat(subregion.countryNames);
      return state;
    }

    case 'CHECK_ITEM_REGION': {
      const region = getItemByName(action.itemName, state.regions);
      const isCheckedAny = region.countryNames.reduce((isChecked, name) =>
        isChecked || state.checkedList.includes(name), false);

      if (isCheckedAny) {
        state.checkedList = state.checkedList.filter(name => !region.countryNames.includes(name));
        return state;
      }
      state.checkedList = state.checkedList.concat(region.countryNames);
      return state;
    }

    case 'ACTIVATE_ACTION':
      return deepMerge(state, {
        activeAction: action.actionName,
      });

    case 'DEACTIVE_ALL_ACTIONS':
      return deepMerge(state, {
        activeAction: ''
      });

    default:
      return state;
  }
});
