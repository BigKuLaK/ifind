import React from 'react';
import IFINDIcon from '../IFINDIcon';

import './styles.scss';

const RatingWarps = ({ percentage }) => {
  const widthPercent = percentage <= 0 ? 0 :
                       percentage >= 100 ? 100 :
                       percentage;

  return (
    <div className="rating-warps">
      <div className="rating-warps__warps rating-warps__warps--fg" style={{ width: `${widthPercent}%` }}>{Array.from({ length: 5}).map(() => <IFINDIcon icon='warp' />)}</div>
      <div className="rating-warps__warps rating-warps__warps--bg">{Array.from({ length: 5}).map(() => <IFINDIcon icon='warp' />)}</div>
    </div>
  )
}

export default RatingWarps;