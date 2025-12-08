import React, { useMemo } from 'react';
import { Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const DiscoverCard = ({ id, title, files = [] }) => {
  const profileImage = useMemo(() => {
    return files.find((x) => x.category === "profile_image")?.path;
  }, [files]);

  return (
    <Link 
      to={`/discover/business/${id}`} 
      className="text-decoration-none text-dark d-flex flex-column align-items-center text-center"
    >
      {profileImage && (
        <Image
          src={profileImage}
          alt={title}
          roundedCircle
          fluid
          className="mb-3 shadow-sm"
          style={{
            width: "165px",
            height: "165px",
            objectFit: "cover",
            borderRadius: "50%",
            border: "2px solid rgba(0, 0, 0, 0.1)",
          }}
        />
      )}
      <p className="mt-2">{title}</p>
    </Link>
  );
};

export default DiscoverCard;