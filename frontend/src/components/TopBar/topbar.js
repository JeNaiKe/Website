import { Link } from "react-router-dom";


function isUser(user) {
  if (user && user.username){
    return (
      <Link to="/profile">JnaiKe</Link> // Get the user name here
    );
  } 
  return (
    <div>
        <Link to="/login"> Login</Link>
        <span className="separator">|</span>
        <Link to="/signup">Sign Up</Link>
    </div>
  );
}


const TopBar = (props) => {
  return (
    <div className="topbar">
      <div className="topbar-content">
        <div className="topbar-sites">
            <Link to="/" className={props.title === "landing" ? "current" : ""}>JnaiKe</Link>
            <span className="separator">│</span>
            <Link to="/" className={props.title === "otherstuff" ? "current" : ""}>Other Stuff</Link>
            <span className="separator">│</span>
            <Link to="/" className={props.title === "personal_tasks" ? "current" : ""}>Personal Tasks</Link>
        </div>
        <div className="topbar-login">
          {isUser(props.user)}
        </div>
      </div>
    </div>
  );
};


export default TopBar;