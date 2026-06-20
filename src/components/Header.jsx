import { Link, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button
} from 'reactstrap';
import { API_URL } from "../config/api";

const Dropdown = ({ token, onLogout }) => {
  if (token) {
    return (
      <DropdownMenu right>
        <DropdownItem href="/account">Account</DropdownItem>
        <DropdownItem onClick={onLogout}>Sign Out</DropdownItem>
      </DropdownMenu>
    )
  } else {
    return (
      <DropdownMenu right>
        <DropdownItem href="/login">Login</DropdownItem>
        <DropdownItem href="/register">Register</DropdownItem>
      </DropdownMenu>
    )
  }
}

function Navigation({ token, setToken }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    const refreshToken = localStorage.getItem("refreshToken");

    fetch(`${API_URL}/user/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken: refreshToken }),
    })
      .catch((error) => console.error("Error during logout:", error));
    localStorage.clear();
    setToken(null);
    navigate("/login");
  };

  const cringe = () => {
    window.alert("I wanted to add a dark mode feature, but I ran out of time.");
  }

  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/movies">Movies</Link></li>
        <li>
          <UncontrolledDropdown inNavbar id="dropdown">
            <DropdownToggle nav caret>
              <img id='account' src="/img/account.png" alt="Account" />
            </DropdownToggle>
            <Dropdown token={token} onLogout={handleLogout} />
          </UncontrolledDropdown>
        </li>
        <li>
          <Button className='nav' id="darkmode" color='link' onClick={cringe}>
            <img src="/img/moon.png" alt="darkmode" style={{ maxHeight: '20px' }} />
          </Button>
        </li>
      </ul>
    </nav>
  );
}

export default function Header({ token, setToken }) {
  return (
    <header>
      <div id="icon">
        <a href="/">
          <img src="/img/icon.png" alt="Icon" a="/"/>
          Movie Finder
        </a>
      </div>
      <Navigation token={token} setToken={setToken} />

    </header>
  );
}
