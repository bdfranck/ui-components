import React from 'react';
import { Callout } from '../callout/Callout';
var i = 0;
/**
 * Show a list Do's and Don'ts in a callout format.
 * @property {string} dos The "do's content text"
 * @property {string} donts The "dont's content text"
 */
export const DoDont = ({ dos, donts }) => {
  return (
    <div>
      <Callout positive={true} content={dos} />
      <Callout positive={false} content={donts} />
    </div>
  );
};
