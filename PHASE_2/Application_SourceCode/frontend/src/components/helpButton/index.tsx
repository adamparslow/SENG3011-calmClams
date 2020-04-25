import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import config from '../../config';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
// import Tooltip from 'react-bootstrap/Tooltip';
import Popover from 'react-bootstrap/Popover';

const HelpButtonStyled = styled.button`
  width: 30px;
  background: ${config.theme.mediumColor};
  border-radius: 0px 5px 5px 0px;
  border: none;
  font-size: 18px;
  color: ${config.theme.primaryLight};
`;

interface HelpButtonProps {
  toolTipTitle: string,
  toolTipMessage: string
};

//TODO: Add typescript typing
const HelpButton = (props: HelpButtonProps) => {
  const [show, setShow] = useState(false);
  const target = useRef(null);

  const popover = (
    <Popover id="popover-basic">
      <Popover.Title as="h3">{props.toolTipTitle}</Popover.Title>
      <Popover.Content>
        {props.toolTipMessage}
      </Popover.Content>
    </Popover>
  );

  return (
    <>
          <OverlayTrigger delay={{ show: 100, hide: 400 }} placement="bottom" overlay={popover}>
        <HelpButtonStyled ref={target} onClick={() => setShow(!show)}>?</HelpButtonStyled>
        {/* <Button variant="success">Click me to see</Button> */}
      </OverlayTrigger>
    </>
  );
};

export default HelpButton;
