import React from 'react';
import ListItem from '../list-item/component'
import SubmitButton from '../submit-button/component'
import { store } from '../../state/store';
import { addTradeRegion } from '../../state/actions';
import { tradeRegions } from '../../util/trade-regions';
import style from '../../util/style';
import css from './styles.scss';

function getCountries(region) {
  fetch(`https://restcountries.eu/rest/v2/regionalbloc/${region}`)
    .then(res => res.json()).then(res => addTradeRegion(region, res));
}


export default class App extends React.Component {
  componentWillMount() {
    this.setState({});
    store.subscribe(() => this.setState(store.getState()));
  }

  componentDidMount() {
    tradeRegions.forEach(region => getCountries(region));
  }

  render() {
    return (
      <div className="master-list">
        {style(css)}

        {this.state.entryList && this.state.entryList.map(regionName =>
          <ListItem
            key={regionName}
            item={this.state.masterList[regionName]}
            masterList={this.state.masterList}
          />
        )}

        <SubmitButton
          activeAction={this.state.activeAction}
          masterList={this.state.masterList}
        />
      </div>
    );
  }
}
