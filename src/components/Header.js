import Logo from "../images/logo.svg";
function Header(props) {
  return (
    <header className="header">
      <img className="logo" src={Logo} alt="Логотип Место" />
    </header>
  );
}
export default Header;
