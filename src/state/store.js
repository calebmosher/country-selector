import { createStore } from 'redux';
import deepMerge from 'deepmerge';
import { tradeRegions } from '../util/trade-regions';

export const store = createStore((state = { countries: [], activeAction: '' }, action) => {
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

    case 'ADD_MASTER_LIST':
      return deepMerge(state, {
        masterList: action.masterList,
        entryList: action.entryList,
      });

    case 'CHECK_ITEM': {
      const item = state.masterList[action.itemName];
      item.isChecked = !(item.isChecked || item.isIndeterminate);
      item.isIndeterminate = false;

      assignCheckedStateToChildren(item);
      function assignCheckedStateToChildren(item) {
        if (!item.children) return;

        item.children.forEach(childName => {
          const child = state.masterList[childName];
          child.isChecked = item.isChecked;
          child.isIndeterminate = false;
          assignCheckedStateToChildren(child);
        });
      }

      assignCheckedStateToParents(item);
      function assignCheckedStateToParents(item) {
        const parentObj = state.masterList[item.parent];
        if (!parentObj) return;

        let isChecked = true;
        let isIndeterminate = false;
        parentObj.children.forEach(childName => {
          const child = state.masterList[childName];
          isChecked = isChecked && child.isChecked;
          isIndeterminate = isIndeterminate || child.isChecked || child.isIndeterminate;
        });

        Object.assign(parentObj, {
          isChecked,
          isIndeterminate: isIndeterminate && !isChecked,
        });
        assignCheckedStateToParents(parentObj);
      }

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
