import React from 'react';
import { deactivateAllActions, activateSpinner, activateSuccess, activateError } from '../../state/actions';


export default class SubmitButton extends React.Component {
  handleClick(e) {
    e.preventDefault();

    activateSpinner();

    const { masterList } = this.props;
    const checkedList = Object.keys(masterList).reduce((checkedCodeList, name) => {
      const { isChecked, alpha2Code } = masterList[name];
      return checkedCodeList.concat(alpha2Code && isChecked ? [alpha2Code] : []);
    }, []);

    fetch('/api/v1/submit-countries', {
      body: JSON.stringify(checkedList),
      headers: { 'content-type': 'application/json' },
      method: 'POST',
    })
    .then(res => {
      deactivateAllActions();
      res.status === 200 ? activateSuccess() : activateError();
    });
  }

  render() {
    const { activeAction } = this.props;
    return (
      <div>
        <a className="submit-button" href="#" onClick={e => this.handleClick(e)}>Submit</a>
        <div className="action spinner" data-active={activeAction === 'spinner'}><span/></div>
        <div className="action success" data-active={activeAction === 'success'}>Success!</div>
        <div className="action error" data-active={activeAction === 'error'}>Oops, something went wrong! Try again.</div>
      </div>
    );
  }
}
