import IfindIcon from "@components/IfindIcon";
import withConditionalRender from "@utilities/hocs/withConditionalRender";

import "./styles.module.scss";

const Warps = (): JSX.Element => (
  <>
    {Array.from({ length: 5 }).map((item, index) => (
      <IfindIcon icon="warp" key={index} />
    ))}
  </>
);

/**
 *
 * @param {Number} props.rating - Rating in decimal (.5 for 50%)
 */
const RatingWarps = ({ rating }: RatingWarpsProps) => {
  const widthPercent = (rating <= 0 ? 0 : rating >= 10 ? 10 : rating) * 10;

  return (
    <div className="rating-warps">
      <div
        className="rating-warps__warps rating-warps__warps--fg"
        style={{ width: `${widthPercent}%` }}
      >
        <Warps />
      </div>
      <div className="rating-warps__warps rating-warps__warps--bg">
        <Warps />
      </div>
    </div>
  );
};

export default withConditionalRender<RatingWarpsProps>(RatingWarps);
