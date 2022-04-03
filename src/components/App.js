import React from "react";
import {
  Route,
  Switch,
  Redirect,
  withRouter,
  useHistory,
} from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import ImagePopup from "./ImagePopup";
import Main from "./Main";
import PopupAddCard from "./PopupAddCard";
import PopupAvatar from "./PopupAvatar";
import PopupEditProfile from "./PopupEditProfile";
import api from "../utils/Api.js";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import Register from "./Register";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";
import * as auth from "./auth";
import InfoTooltip from "./InfoTooltip";

function App() {
  const [loggedIn, setLoggedIn] = React.useState(false);

  // Стейт, в котором содержится значение попапов
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);

  // Стейт, в котором содержится значение выбранной карточки
  const [selectedCard, setselectedCard] = React.useState({
    name: "",
    link: "",
  });

  // Стейт, в котором содержится значение Пользователя
  const [currentUser, setCurrentUser] = React.useState({});

  // Стейт, в котором содержится значение карточек
  const [cards, setCards] = React.useState([]);

  // Стейт, в котором содержится значение попапа при регистрации, используем для открытия и закрытия модального окна
  const [toolTip, setToolTip] = React.useState(false);

  // Стейт, в котором содержится значение попапа, используем для установки статуса и вызова нужного модального окна
  const [toolTipStatus, setToolTipStatus] = React.useState(false);
  console.log("status", toolTipStatus);

  // Стейт, в котором содержится значение об имейле пользователя
  const [userEmail, setUserEmail] = React.useState("");


  const [userEmailStatus, setUserEmailStatus] = React.useState(false);

  // используем для сохранения/удаления данных об вошедшем пользователе
  const history = useHistory();

  // Обработчик открытия попапа Аватара обновляет стейт
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  // Обработчик открытия попапа Редактирование профиля обновляет стейт
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  // Обработчик открытия попапа Добавить Место обновляет стейт
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  // отображение объявления о статусе регистрации
  function handleToolTipShow() {
    setToolTip(true);
  }

  // Обработчик открытия попапа Большой картинки обновляет стейт
  function handleCardClick(card) {
    setselectedCard(card);
  }

  // обработчик добавления новой карточки
  function handleAddPlaceSubmit(card) {
    api
      .addCard(card)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log("ERROR", err));
  }

  // обработчик изменения информации о пользователе
  function handleUpdateUser(user) {
    api
      .patchUserInfo(user)
      .then((userData) => {
        setCurrentUser(userData);
        closeAllPopups();
      })
      .catch((err) => console.log("ERORR", err));
  }

  // обработчик смены аватара
  function handleUpdateAvatar(user) {
    api
      .patchAvatar(user)
      .then((userData) => {
        setCurrentUser(userData);
        closeAllPopups();
      })
      .catch((err) => console.log("ERORR", err));
  }

  // Обработчик закрытия попапа обновляет стейт
  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setselectedCard({ name: "", link: "" });
    setToolTip(false);
  }

  // получаем данные о пользователе и карточках на странице
  React.useEffect(() => {
    Promise.all([api.getUserInfo(), api.getCards()])
      .then(([userData, cardsList]) => {
        setCurrentUser(userData);
        setCards(cardsList);
      })
      .catch((err) => console.log("Ошибка", err));
  }, []);

  // обработчик постановки лайка
  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => console.log("ERORR: LIKE AREA", err));
  }

  // обработчик удаления карточки
  function handleCardDelete(card) {
    api.deleteCard(card._id).then(() => {
      setCards((cards) => cards.filter((x) => x !== card));
    });
  }

  React.useEffect(() => {
    handleTokenCheck();
  }, []);

  const handleTokenCheck = () => {
    // достаем инфо из локалсторедж
    const jwt = localStorage.getItem("jwt");
    console.log("jwt", jwt);
    if (jwt) {
      // проверяем токен пользователя
      auth
        .checkToken(jwt)
        .then((res) => {
          if (res) {
            setUserEmail(res.data.email);
            setLoggedIn(true);
            history.push("/main");
          }
        })
        .catch((err) => console.log(err));
    }
  };

  // 
  function handleLogin()  {
    setLoggedIn(true);
    setUserEmailStatus(true);
    handleTokenCheck();
  };

  function handleLogout(evt) {
    evt.preventDefault();

    localStorage.removeItem("jwt");
    setLoggedIn(false);
    setUserEmailStatus(false);
    // history.push("/sign-in");
  };

  return (
    <div>
      <CurrentUserContext.Provider value={currentUser}>
        {/* <Header onLogout={handleLogout}/> */}
        {/* <Main
          // onEditProfile={handleEditProfileClick}
          // onAddPlace={handleAddPlaceClick}
          // onEditAvatar={handleEditAvatarClick}
          // onCardClick={handleCardClick}
          // onCardLike={handleCardLike}
          // onCardDelete={handleCardDelete}
          // cards={cards}
        > */}
        {/* {loggedIn} */}
        <Switch>
          <ProtectedRoute
            component={Main}
            path="/main"
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
            cards={cards}
            loggedIn={loggedIn}
            exit={handleLogout}
            status={userEmailStatus}
            userEmail={userEmail}
          />

          <Route path="/sign-up">
            <Register
              onToolTip={handleToolTipShow}
              toolTipStatus={setToolTipStatus}
            />
          </Route>
          <Route path="/sign-in">
            <Login onLogin={handleLogin} />
          </Route>
          <Route exact path="/">
            {loggedIn ? <Redirect to="/main" /> : <Redirect to="/sign-in" />}
          </Route>
          <Route path="*">{<Redirect to="/" />}</Route>
        </Switch>
        <Footer />
        <PopupAvatar
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />
        <PopupEditProfile
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />
        <PopupAddCard
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />
        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
        <InfoTooltip
          isOpen={toolTip}
          onClose={closeAllPopups}
          status={toolTipStatus}
        />
      </CurrentUserContext.Provider>
    </div>
  );
}

export default withRouter(App);
