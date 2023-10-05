import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { Link } from "react-router-dom";

const BackArrow = () => {
  return (
    <div>
      <Link to="/">
        <FontAwesomeIcon
          icon={solid("arrow-left")}
          style={{ fontSize: "2rem" }}
        />
      </Link>
    </div>
  );
};

export default BackArrow;
