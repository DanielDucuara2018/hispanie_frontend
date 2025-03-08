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

// Function to return the popover with dynamic URL
const getSharePopover = (url) => (
  <Popover id="share-popover">
    <Popover.Body className="d-flex justify-content-around gap-2">
      <FacebookShareButton url={url}>
        <FacebookIcon size={32} round />
      </FacebookShareButton>
      <TwitterShareButton url={url}>
        <TwitterIcon size={32} round />
      </TwitterShareButton>
      <LinkedinShareButton url={url}>
        <LinkedinIcon size={32} round />
      </LinkedinShareButton>
      <WhatsappShareButton url={url}>
        <WhatsappIcon size={32} round />
      </WhatsappShareButton>
    </Popover.Body>
  </Popover>
);

class ShareButton extends Component {
  render() {
    const { url = window.location.href } = this.props; // fallback to current page if not provided

    return (
      <OverlayTrigger
        trigger="click"
        placement="bottom"
        overlay={getSharePopover(url)}
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