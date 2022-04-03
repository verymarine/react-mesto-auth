import { errorMonitor } from "events";
import React from "react";
import { Link, withRouter } from "react-router-dom";
import * as auth from "./auth";
import Header from "./Header";

function Login({ onLogin }) {
  const [values, setValues] = React.useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!values.email || !values.password) {
      return;
    }
    auth
      .authorize(values.email, values.password)
      .then((res) => {
        if (res.token) {
          setValues({
            //обновить стейт при успешной запросе поля формы очистятся и
            email: "",
            password: "",
          });
        }
        localStorage.setItem("jwt", res.token); // то мы должны локал сторедж записать джвт и рес джвт / запись токенов в локал сторедж
        onLogin(); // вызывется колбэк который зpадан снаружи в случа успешной регистрации и после этого редирект
        console.log(res.token);
      })
      .catch((err) => console.log("Error at logIn", err));
  };

  return (
    <>
      <Header textAuth="Регистрация" linkHeader="sign-up" />
      <div className="login">
        <p className="login__title">Вход</p>
        <form onSubmit={handleSubmit} className="login__form">
          <input
            className="login__input"
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            value={values.email}
            onChange={handleChange}
          />
          <input
            className="login__input"
            id="password"
            name="password"
            type="password"
            placeholder="Пароль"
            value={values.password}
            onChange={handleChange}
          />

          <button
            className="login__button"
            type="submit"
            onSubmit={handleSubmit}
          >
            Войти
          </button>
        </form>
      </div>
    </>
  );
}

export default withRouter(Login);
