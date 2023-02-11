import React, { Component } from 'react';
import css from './Button.module.css';
export class Button extends Component {
  render() {
    return (
      <div className={css.container}>
        <button className={css.button} onClick={this.props.onClick}>
          load more
        </button>
      </div>
    );
  }
}
