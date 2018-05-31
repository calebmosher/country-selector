import React from 'react';
import RegionList from '../region-list/component.js'
import SubmitButton from '../submit-button/component.js'
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

        {this.state.regions && this.state.regions.map(region =>
          <RegionList key={region.name} item={region} parentList={[]} checkedList={this.state.checkedList} />
        )}

        <SubmitButton checkedList={this.state.checkedList} ietfMap={this.state.ietfMap} activeAction={this.state.activeAction} />
      </div>
    );
  }
}
