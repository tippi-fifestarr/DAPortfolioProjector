import React from "react";
import { Menu, Icon } from "semantic-ui-react";
import { Link } from '../routes';//pulling off just the Link from routes

const Header = () => {
  return (
    //notice <Link route="/"> because styling of Link and Menu.Item clash
    <Menu style={{ marginTop: "10px" }}>
      <Link route="/"/*generic wrapper component*/> 
        <a className="item"/*restores semantic ui nicenesss*/> 
          D____________ A______ Portfolio Projector 
          <Icon name='folder open outline' />
        </a>
      </Link>
      <Menu.Menu position="right">
        <Link route="/"/*identical link*/> 
          <a className="item"/*nice*/> 
          <Icon name='dollar' />
          All_My_Projects
          {/* <Icon name='spinner' /> */}
          </a>
        </Link>
        <Link route="/projects/new"/*new projects!*/> 
          <a className="item"/*restores semantic ui nicenesss*/> 
            New + 
            <Icon loading name='spinner' />
            + Proj
          </a>
        </Link>
      </Menu.Menu>
    </Menu>
  );
};

export default Header;
