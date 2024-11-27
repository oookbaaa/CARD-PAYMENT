import { useState } from "react";
import allowed from "./config";
import { allowed2 } from "./config";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCreditCard, faCalendarAlt, faLock } from '@fortawesome/free-solid-svg-icons';
import mastercardLogo from './assets/pngwing.com.png';
import puce from './assets/puce.png';



function App() {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [message, setMessage] = useState("");
  const [submit, setSubmit] = useState(false);
  

  return (
    <Container>
      {!submit ? (
        <>
          <CardDisplay name={name} number={number} expiry={expiry}  cvv={cvv} />
          <Form
            name={name}
            setName={setName}
            number={number}
            setNumber={setNumber}
            expiry={expiry}
            setExpiry={setExpiry}
            cvv={cvv}
            setCvv={setCvv}
            message={message}
            setMessage={setMessage}
            setSubmit={setSubmit}
          />
        </>
      ) : (
        <Submit setSubmit={setSubmit} />
      )}
    </Container>
  );
}

function Container({ children }) {
  return <div className="container">{children}</div>;
}

function Submit({ setSubmit }) {
  return (
    <div>
      <button className="btn-close" onClick={() => setSubmit(false)}>
        X
      </button>
      <p className="success">Your details have been saved</p>
    </div>
  );
}

function CardDisplay({ name, number, expiry ,cvv}) {
  const [flipped, setFlipped] = useState(false);
  const handleCardClick = () => {
    setFlipped(!flipped);
  };
  return (
    <div className={`card-container ${flipped ? 'flipped' : ''}`} onClick={handleCardClick}>
      {/* Front Side */}
    <div className="card">
      <img src={puce} alt="puce" className="puce" />
      <img src={mastercardLogo} alt="MasterCard logo" className="card-logo" />
      <p className="card-number">{number || "0000 0000 0000 0000"}</p>

      <div className="card-owner">
        <p className="card-label">Card Holder</p>
        <p className="card-info">{name || "BEDHIAFI OKBA"}</p>
      </div>
      <div className="card-valid">
        <p className="card-label">Valid Through</p>
        <p className="card-info">{expiry || "MM/YY"}</p>
      </div>
      </div>


{/* Back Side */}
<div className="card-back">
        <div className="card-cvv">
          <p className="card-label">CVV</p>
          <p className="card-info">{cvv || "123"}</p>
        </div>
      </div>


    </div>
    
  );
}

function formatNumber(number, inputType, previousNum) {
  const addSpacePositons = [4, 9, 14];
  const returnValue = addSpacePositons.includes(number.length)
    ? number + " "
    : number;

  if (number.split("").some((num) => !allowed2.includes(num.padStart(2, "0"))))
    return previousNum;

  return inputType !== "deleteContentBackward" ? returnValue : number;
}

function formatValidateDate(date, inputType, setMessage) {
  if (!allowed.includes(date.length >= 2 ? date.slice(0, 2) : "0"))
    setMessage("Invalid date");
  else setMessage("");

  if (date.length === 5 && +date.slice(-2) < 24)
    setMessage("Card has already expired");
  else if (allowed.includes(date.length >= 2 ? date.slice(0, 2) : "0"))
    setMessage("");

  return date.length === 2 &&
    allowed.includes(date) &&
    inputType !== "deleteContentBackward"
    ? date + "/"
    : date;
}

function validateName(name) {
  const lowerCase = "abcdefghijklmnopqrstuvwxyz";
  const upperCase = lowerCase.toUpperCase();
  const allowed = lowerCase + upperCase + " ";

  return name.split("").every((letter) => allowed.includes(letter));
}

function Form({
  name,
  setName,
  number,
  setNumber,
  expiry,
  setExpiry,
  cvv,
  setCvv,
  message,
  setMessage,
  setSubmit,
}) {
  function handleSubmit(e) {
    e.preventDefault();
    if (number.length < 19) setMessage("Invalid Card Number");
    else if (expiry.length < 5) setMessage("Invalid Expiry Date");
    else if (cvv.length < 3) setMessage("Invalid CVV");
    else {
      setMessage("");
      setSubmit(true);
      setName("");
      setNumber("");
      setCvv("");
      setExpiry("");
    }
  }

  return (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <h2 className="form-heading">Payment Details</h2>

        <label>
          <FontAwesomeIcon icon={faUser} className="icon" />
          <span className="label-text"> Cardholder Name</span>
        </label>
        <input
          type="text"
          placeholder="BEDHIAFI Okba"
          value={name}
          onChange={(e) =>
            setName((name) =>
              validateName(e.target.value) ? e.target.value : name
            )
          }
          required
        />

        <label>
          <FontAwesomeIcon icon={faCreditCard} className="icon" />
          <span className="label-text"> Card Number</span>
        </label>
        <input
          type="text"
          placeholder="0000 0000 0000 0000"
          value={number}
          onChange={(e) =>
            setNumber((number) =>
              number.length > 18 &&
              e.nativeEvent.inputType !== "deleteContentBackward"
                ? number
                : formatNumber(e.target.value, e.nativeEvent.inputType, number)
            )
          }
          required
        />

        <div className="form-details">
          <div>
            <label>
              <FontAwesomeIcon icon={faCalendarAlt} className="icon" />
              <span className="label-text"> Expiry Date</span>
            </label>
            <input
              type="text"
              placeholder="03/27"
              value={expiry}
              onChange={(e) =>
                setExpiry((expiry) =>
                  expiry.length >= 5 &&
                  e.nativeEvent.inputType !== "deleteContentBackward"
                    ? expiry
                    : formatValidateDate(
                        e.target.value,
                        e.nativeEvent.inputType,
                        setMessage
                      )
                )
              }
              required
            />
            <p className={message ? "error" : "hidden error"}>🚩 {message}</p>
          </div>
          <div>
            <label>
              <FontAwesomeIcon icon={faLock} className="icon" />
              <span className="label-text">  CVV</span>
            </label>
            <input
              type="text"
              placeholder="123"
              value={cvv}
              onChange={(e) =>
                setCvv((cvv) =>
                  cvv.length >= 3 &&
                  e.nativeEvent.inputType !== "deleteContentBackward"
                    ? cvv
                    : e.target.value
                )
              }
              required
            />
          </div>
        </div>

        <button className="btn-confirm">Confirm</button>
      </form>
    </div>
  );
}

export default App;
