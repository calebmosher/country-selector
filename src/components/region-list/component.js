import React from 'react';
import { checkItem } from '../../state/actions';


export default class RegionList extends React.Component {
  handleChangeCheckbox(e) {
    checkItem(this.props.item.name, this.props.parentList);
  }

  isChecked() {
    const hasSelf = this.props.checkedList.includes(this.props.item.name);
    const hasAllChildren = this.props.item.countryNames && this.props.item.countryNames.reduce((hasAll, name) =>
      hasAll && this.props.checkedList.includes(name), true);

    return hasSelf || hasAllChildren;
  }

  isIndeterminate() {
    return this.props.item.countryNames && this.props.item.countryNames.reduce((isIndeterminate, name) =>
      isIndeterminate || this.props.checkedList.includes(name), false) ? 'true' : undefined;
  }

  componentDidUpdate() {
    this.refs.checkbox.indeterminate = this.refs.checkbox.getAttribute('indeterminate') && !this.isChecked();
  }

  render() {
    return (
      <div className="region-list" data-has-children={this.props.item.children}>
        <div className="title">
          <label>
            <input
              ref="checkbox"
              onChange={() => this.handleChangeCheckbox()}
              type="checkbox"
              checked={this.isChecked()}
              indeterminate={this.isIndeterminate()}
            />
            <span className="title-text">{this.props.item.name}</span>
          </label>
        </div>
        {this.props.item.children && this.props.item.children.map(child =>
          <RegionList key={child.name} item={child} parentList={this.props.parentList.concat([this.props.item.name])}  checkedList={this.props.checkedList} />
        )}
      </div>
    );
  }
}
