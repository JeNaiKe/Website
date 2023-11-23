const Footer = (props) => {
    return (
      <div className="footer">
        <div className="footer-content panel">
          <div className="footer-links panel-inset m0 ">
            <a href="contacts">Contact</a>
            <span className="separator">|</span>
            <a href="https://www.linkedin.com/in/joao-duarteee">LinkedIn</a>
            <span className="separator">|</span>
            <a href="">Filler</a>
            <span className="separator">|</span>
            <a href="">Sample</a>
          </div>
          <div className="footer-middle panel-inset m0 p0"></div>
          <div className="footer-copyright panel-inset m0">Copyright © 2023 - all rights reserved.</div>
        </div>
      </div>
    );
  };

export default Footer;