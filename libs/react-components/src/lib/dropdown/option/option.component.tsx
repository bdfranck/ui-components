import React, { FC, useState, useContext } from 'react';
import { DropdownContext, DropdownOption } from '../dropdown.context';
import classnames from 'classnames'

interface Props {
  value: string;
  label: string;
  defaultSelected?: boolean;
}

export const GoAOption: FC<Props> = ({ value, label, children }) => {
  const [isActive, setActive] = useState<string>('');
  const { filter, matchesFilter, options, updateOption } = useContext(DropdownContext);

  function selectValue(e: { stopPropagation: () => void; }) {
    e.stopPropagation();
    updateOption(value, new DropdownOption(value, label, options[value] ? !options[value].selected : true));
  }

  function rootCss() {
    return classnames({
      option: true,
      selected: options[value] && options[value].selected,
      isActive
    })
  }

  return (
    matchesFilter(filter, label) &&
      <div
        role="listitem"
        className={rootCss()}
        onClick={selectValue}
        onMouseEnter={() => { setActive('active'); }}
        onMouseLeave={() => { setActive(''); }}
      >
        <div className="goa-option">
          {children || label}
        </div>
      </div>
  );
};

GoAOption.defaultProps = {
  defaultSelected: false
}

export default GoAOption;