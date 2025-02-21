import React, { Component } from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
} from 'react-share';
import { LuShare } from "react-icons/lu";
import { Button, OverlayTrigger, Popover } from 'react-bootstrap';

const SharePopover = (
  <Popover id="share-popover">
    <Popover.Body className="d-flex justify-content-around">
      <FacebookShareButton url={window.location.href}>
        <FacebookIcon size={32} round />
      </FacebookShareButton>
      <TwitterShareButton url={window.location.href}>
        <TwitterIcon size={32} round />
      </TwitterShareButton>
      <LinkedinShareButton url={window.location.href}>
        <LinkedinIcon size={32} round />
      </LinkedinShareButton>
      <WhatsappShareButton url={window.location.href}>
        <WhatsappIcon size={32} round />
      </WhatsappShareButton>
    </Popover.Body>
  </Popover>
);

class ShareButton extends Component {
  render() {
    return (
      <OverlayTrigger
        trigger="click"
        placement="bottom"
        overlay={SharePopover}
        rootClose
      >
        <Button variant="outline-dark">
          <LuShare />
        </Button>
      </OverlayTrigger>
    );
  }
}

export default ShareButton;