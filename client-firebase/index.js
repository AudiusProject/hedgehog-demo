/* globals React, Firebase, Hedgehog */
const useState = React.useState;
const useEffect = React.useEffect;
const useRef = React.useRef;

const AUTH_TABLE = "Authentications";
const USER_TABLE = "Users";

const messages = {
  signedIn: {
    header: `You're Signed In!`,
    body: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Massa tempor nec feugiat nisl pretium.`
  },
  signedOut: {
    header: `You're Not Signed In`,
    body: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Massa tempor nec feugiat nisl pretium.`
  },
  invalid: `Incorrect email or password. Try again.`,
  empty: `Please enter an email and password.`,
  exists: `Account already exists, please try logging in.`,
  mismatched: `The passwords you entered don't match.`
};

const firebase = new Firebase();
const setAuthFn = async obj =>
  firebase.createIfNotExists(AUTH_TABLE, obj.lookupKey, obj);
const setUserFn = async obj =>
  firebase.createIfNotExists(USER_TABLE, obj.email, obj);
const getFn = async obj => firebase.readRecordFromFirebase(AUTH_TABLE, obj);
const hedgehog = new Hedgehog(getFn, setAuthFn, setUserFn);

const Tabs = props => {
  return (
    <div className="tabs">
      <div className="headers">
        {props.tabs.map((tab, i) => (
          <div
            key={i}
            onClick={() => props.setActiveTab(i)}
            className={i === props.activeTab ? "tab active" : "tab"}
          >
            {tab}
          </div>
        ))}
      </div>
      <div className="content">{props.children[props.activeTab]}</div>
    </div>
  );
};

const Pill = props => {
  const styles = props.text === "authenticated" ? "pill green" : "pill red";
  return <div className={styles}>{props.text}</div>;
};

const Spinner = props => {
  return (
    <div className="spinner">
      <div />
    </div>
  );
};

const Button = props => {
  let styles = "button";
  if (props.fullWidth) styles += " fullWidth";
  if (props.loading) styles += " loading";
  return (
    <div
      onClick={() => (props.loading ? {} : props.onClick())}
      className={styles}
    >
      {props.loading ? <Spinner /> : null}
      {props.text}
    </div>
  );
};

const Link = props => {
  return (
    <div onClick={props.onClick} className="link">
      <span>{props.text}</span>
    </div>
  );
};

const App = props => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const checkWalletStatus = () => {
    if (hedgehog.isLoggedIn()) {
      setSignedIn(true);
      // Retrieve wallet with: hedgehog.getWallet()
    } else {
      if (
        hedgehog &&
        hedgehog.walletExistsLocally &&
        hedgehog.walletExistsLocally()
      ) {
        setSignedIn(true);
        // Retrieve wallet with: hedgehog.restoreLocalWallet()
      } else {
        setSignedIn(false);
      }
    }
  };

  const handleSignUp = async event => {
    if (password !== passwordConfirmation) {
      setErrorMessage(messages.mismatched);
    } else if (!password || !email || !passwordConfirmation) {
      setErrorMessage(messages.empty);
    } else {
      setLoading(true);
      setErrorMessage("");
      try {
        await hedgehog.signUp(email, password);
        checkWalletStatus();
      } catch (e) {
        console.error(e);
        setErrorMessage(messages.exists);
      }
      setLoading(false);
    }
  };

  const handleLogin = async event => {
    setErrorMessage("");
    setLoading(true);
    try {
      await hedgehog.login(email, password);
      checkWalletStatus();
    } catch (e) {
      console.error(e);
      setErrorMessage(messages.invalid);
    }
    setLoading(false);
  };

  const changeTab = i => {
    setErrorMessage("");
    setActiveTab(i);
  };

  const logout = () => {
    hedgehog.logout();
    checkWalletStatus();
  };

  useEffect(() => {
    checkWalletStatus();
  });

  return (
    <div className="app">
      {signedIn ? (
        <div className="message">
          <Pill text="authenticated" />
          <h1>{messages.signedIn.header}</h1>
          <p>{messages.signedIn.body}</p>
          <Button loading={loading} onClick={logout} text="Log Out" />
        </div>
      ) : (
        <>
          <Tabs
            tabs={["Create Account", "Log In"]}
            activeTab={activeTab}
            setActiveTab={changeTab}
          >
            {/* Create Account Tab */}
            <div className="form">
              <div className="fields">
                <input
                  className={errorMessage && !email ? "error" : null}
                  placeholder="Email"
                  onChange={e => setEmail(e.target.value)}
                />
                <input
                  className={errorMessage ? "error" : null}
                  placeholder="Password"
                  onChange={e => setPassword(e.target.value)}
                  type="password"
                />
                <div>
                  <input
                    className={errorMessage ? "error" : null}
                    placeholder="Confirm Password"
                    onChange={e => setPasswordConfirmation(e.target.value)}
                    type="password"
                  />
                  <p className="error">{errorMessage}</p>
                </div>
              </div>
              <div className="buttons">
                <Button
                  onClick={handleSignUp}
                  fullWidth
                  loading={loading}
                  text="Create My Account"
                />
                <Link
                  onClick={() => changeTab(1)}
                  text="I already have an account."
                />
              </div>
            </div>

            {/* Log In Tab */}
            <div className="form">
              <div className="fields">
                <input
                  placeholder="Email"
                  onChange={e => setEmail(e.target.value)}
                />
                <div>
                  <input
                    className={errorMessage ? "error" : null}
                    placeholder="Password"
                    onChange={e => setPassword(e.target.value)}
                    type="password"
                  />
                  <p className="error">{errorMessage}</p>
                </div>
              </div>
              <div className="buttons">
                <Button
                  onClick={handleLogin}
                  fullWidth
                  loading={loading}
                  text="Log In"
                />
                <Link onClick={() => changeTab(0)} text="Create Account" />
              </div>
            </div>
          </Tabs>

          <div className="message">
            <Pill text="unauthenticated" />
            <h1>{messages.signedOut.header}</h1>
            <p>{messages.signedOut.body}</p>
          </div>
        </>
      )}
    </div>
  );
};

const domContainer = document.querySelector("#root");
ReactDOM.render(React.createElement(App), domContainer);
