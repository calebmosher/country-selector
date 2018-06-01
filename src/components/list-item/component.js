import React from 'react';
import { checkItem } from '../../state/actions';


export default class ListItem extends React.Component {
  handleChangeCheckbox(e) {
    checkItem(this.props.item.name);
  }

  componentDidUpdate() {
    this.refs.checkbox.indeterminate = this.refs.checkbox.getAttribute('indeterminate');
  }

  render() {
    return (
      <div className="list-item" data-has-children={this.props.item.children}>
        <div className="title">
          <label>
            <input
              ref="checkbox"
              onChange={() => this.handleChangeCheckbox()}
              type="checkbox"
              checked={this.props.item.isChecked}
              indeterminate={this.props.item.isIndeterminate ? 'true' : undefined}
            />
            <span className="title-text">{this.props.item.name}</span>
          </label>
        </div>
        {this.props.item.children && this.props.item.children.map(childName =>
          <ListItem
            key={childName}
            item={this.props.masterList[childName]}
            checkedList={this.props.checkedList}
            masterList={this.props.masterList}
          />
        )}
      </div>
    );
  }
}
