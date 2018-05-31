import React from 'react';
import { deactivateAllActions, activateSpinner, activateSuccess, activateError } from '../../state/actions';


export default class SubmitButton extends React.Component {
  handleClick(e) {
    e.preventDefault();

    activateSpinner();
    const checkedIetfList = this.props.checkedList.map(name => this.props.ietfMap[name]);

    fetch('/api/v1/submit-countries', {
      body: JSON.stringify(checkedIetfList),
      headers: { 'content-type': 'application/json' },
      method: 'POST',
    })
    .then(res => {
      deactivateAllActions();
      res.status === 200 ? activateSuccess() : activateError();
    });
  }

  render() {
    return (
      <div>
        <a className="submit-button" href="#" onClick={(e) => this.handleClick(e)}>Submit</a>
        <div className="action spinner" data-active={this.props.activeAction === 'spinner'}><span/></div>
        <div className="action success" data-active={this.props.activeAction === 'success'}>Success!</div>
        <div className="action error" data-active={this.props.activeAction === 'error'}>Oops, something went wrong! Try again.</div>
      </div>
    );
  }
}
