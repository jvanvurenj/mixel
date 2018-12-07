/*
 * Select component for choosing instrument type
 *
 * Last Edit: Pallavi Webb, 11-25-18
*/

import React from 'react';

export const Select = (props) => {
  return (
    <label>
      {props.label}
      <select
        name={props.name}
        value={props.value}
        onChange={props.handleChange}
      >
      {props.options.map(option => {
        return (
          <option
            key={option}
            value={option}
            label={option}>
            {option}
          </option>
      );
      })};
      </select>
    </label>
  )
}
