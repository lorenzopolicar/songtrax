import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { Link } from "react-router-dom";

/**
 * BackArrow Component
 *
 * This component renders a back arrow icon that allows users to navigate back to a specified route.
 *
 * @returns {JSX.Element} JSX element representing the BackArrow component.
 */
const BackArrow = () => {
  return (
    <div>
      <Link to="/">
        <FontAwesomeIcon
          icon={solid("arrow-left")} // Specify the arrow-left icon from Font Awesome
          style={{ fontSize: "2rem" }}
        />
      </Link>
    </div>
  );
};

export default BackArrow;
