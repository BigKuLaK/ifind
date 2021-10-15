import React, { FunctionComponent } from 'react';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { IconName } from '@fortawesome/fontawesome-common-types';

interface FAIconProps {
  icon : IconName
}

const FontAwesomeIcon: FunctionComponent<any> = (props: FAIconProps) => (
  <Icon {...props} />
);

export default FontAwesomeIcon;