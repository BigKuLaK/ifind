import './styles.module.scss';
import { useState } from "react";
import withConditionalRender from '@utilities/hocs/withConditionalRender';

const PercentCircle = ({ percent }: PercentCircleProps) => {
  // 0% = -289px, 100% = 0
  const strokeDashOffset = -301 * (100 - (percent === null ? 0 : percent)) / 100;
  const [openTooltip, setOpenTooltip] = useState<boolean>(false);

  return (
    <>
      <div className="percent-circle" tabIndex={1} onClick={(event) => {
        event.preventDefault();
        event?.stopPropagation();
        setOpenTooltip(!openTooltip);
      }}>
        <svg className="percent-circle__svg" viewBox="0 0 100 100" style={{ strokeDashoffset: `${strokeDashOffset}px` }}>
          <circle cx="50" cy="50" r="48" />
        </svg>
        <div className="percent-circle__number">{percent === null ? '?' : `${percent}%`}</div>
        {openTooltip && <aside className={["percent-circle__tooltip", openTooltip === true ? "active" : ""].join(" ")}>
          {percent === null ? 'Stocks information is not available for this item' : (
            <><strong>{percent}%</strong> of stocks are still available</>
          )}
        </aside>}
      </div>
    </>
  );
};

export default withConditionalRender<PercentCircleProps>(PercentCircle);
