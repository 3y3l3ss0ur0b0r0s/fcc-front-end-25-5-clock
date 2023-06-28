class SpecialClock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startStopString: "Start",
      timerString: "Timer",
      breakLength: 5,
      sessionLength: 25,
      remainingTime: 1500000,
      currentMode: "RESET" };


    this.updateState = this.updateState.bind(this);

    // MODIFY STATE
    this.decrementBreak = this.decrementBreak.bind(this);
    this.incrementBreak = this.incrementBreak.bind(this);
    this.decrementSession = this.decrementSession.bind(this);
    this.incrementSession = this.incrementSession.bind(this);
    this.reset = this.reset.bind(this);

    // PRESENTATION
    this.toTimeString = this.toTimeString.bind(this);
    this.switchButton = this.switchButton.bind(this);

    const intervalId = setInterval(this.updateState, 1000);
  } // END CONSTRUCTOR

  // UPDATE VIEW BASED ON UPDATED STATE
  componentDidUpdate(prevProps, prevState) {
    //console.log("Component updated.");
    // SET STATE TO UPDATE REMAINING TIME
    if (
    prevState.breakLength != this.state.breakLength ||
    prevState.sessionLength != this.state.sessionLength || prevState.currentMode != this.state.currentMode)
    {
      console.log("- Break length, session length, or current mode changed. Updating remainingTime for " + this.state.currentMode + " (" + this.state.timerString + ")");
      this.setState({
        remainingTime:
        this.state.currentMode == "SESSION" || this.state.currentMode == "RESET" ?
        this.state.sessionLength * (1000 * 60) :
        this.state.breakLength * (1000 * 60) });

      console.log("\t\tRemaining time: " + this.state.remainingTime);
    }

    // SET STATE TO UPDATE TIMERSTRING
    if (prevState.currentMode != this.state.currentMode && prevState.timerString != this.state.timerString) {
      console.log("- Current mode changed from " + prevState.currentMode + " to " + this.state.currentMode + ". Updating timerString and remainingTime.");
      console.log("\t\t*** Label changed from " + prevState.timerString + " to " + this.state.timerString);
      console.log("\t\tTimer string: " + this.state.timerString + ", remaining time: " + this.state.remainingTime);
    }

    // SET STATE TO UPDATE START/STOP BUTTON
    if (prevState.startStopString != this.state.startStopString) {
      console.log("- Start/stop button text changed Updated render.");
    }
  } // END COMPONENT DID UPDATE

  // THIS IS CALLED EVERY INTERVAL; IT ADJUSTS THE TIME
  // THIS IS RESPONSIBLE FOR THE COUNTDOWN
  updateState() {
    if (this.state.remainingTime == 5000) {
      document.getElementById("beep").load();
      //console.log("Loading sound!");
    }
    if (this.state.remainingTime == 1000) {
      document.getElementById("beep").play();
    }

    if (this.state.startStopString == "Start") {
      // TIMER IS PAUSED; STOP LOOPING
      clearInterval(this.intervalId);
    } else if (this.state.remainingTime > 0) {
      // TIMER IS STILL GOING; CONTINUE LOOPING
      this.setState({
        remainingTime: this.state.remainingTime - 1000 });

    }

    // SWITCH MODE (SESSION/BREAK)
    if (this.state.remainingTime == 0) {
      console.log("- Remaining time has reached 0 while mode is " + this.state.currentMode + ", and timer label is " + this.state.timerString + ".");
      this.setState({
        timerString: this.state.currentMode == "SESSION" ? "Break Time!" : "Current Session",
        remainingTime: this.state.currentMode == "SESSION" ? this.state.breakLength * (1000 * 60) : this.state.sessionLength * (1000 * 60),
        currentMode: this.state.currentMode == "SESSION" ? "BREAK" : "SESSION" });

      console.log("\tMode changed to " + this.state.currentMode + ", and timer label is " + this.state.timerString + ".");
    }
  } // END UPDATESTATE

  decrementBreak(e) {
    console.log("Decrementing break...");
    if (
    this.state.breakLength > 1 && (
    this.state.currentMode != "BREAK" ||
    this.state.startStopString != "Stop"))
    {
      this.setState({
        breakLength: this.state.breakLength - 1 });

    } else if (this.state.breakLength == 1) {
      console.log("\tCan't decrement break; break is already minimum length.");
    } else if (this.state.currentMode == "BREAK") {
      console.log("\tCan't decrement break; currently in break session.");
    } else {
      console.log("\tCan't decrement break; timer is currently running.");
    }
  } // END DECREMENT BREAK

  incrementBreak(e) {
    console.log("Incrementing break...");
    if (
    this.state.breakLength < 60 && (
    this.state.currentMode != "BREAK" ||
    this.state.startStopString != "Stop"))
    {
      this.setState({
        breakLength: this.state.breakLength + 1 });

    } else if (this.state.breakLength == 60) {
      console.log("\tCan't increment break; break is already maximum length.");
    } else if (this.state.currentMode == "BREAK") {
      console.log("\tCan't increment break; currently in break session.");
    } else {
      console.log("\tCan't decrement break; timer is currently running.");
    }
  } // END INCREMENT BREAK

  decrementSession(e) {
    console.log("Decrementing session...");
    if (
    this.state.sessionLength > 1 && (
    this.state.currentMode != "SESSION" ||
    this.state.startStopString != "Stop"))
    {
      this.setState({
        sessionLength: this.state.sessionLength - 1 });

    } else if (this.state.sessionLength == 1) {
      console.log(
      "\tCan't decrement session; session is already minimum length.");

    } else if (this.state.currentMode == "SESSION") {
      console.log("\tCan't decrement session; currently in session.");
    } else {
      console.log("\tCan't decrement session; timer is currently running.");
    }
  } // END DECREMENT SESSION

  incrementSession(e) {
    console.log("Incrementing session...");
    if (
    this.state.sessionLength < 60 && (
    this.state.currentMode != "SESSION" ||
    this.state.startStopString != "Stop"))
    {
      this.setState({
        sessionLength: this.state.sessionLength + 1 });

    } else if (this.state.sessionLength == 60) {
      console.log(
      "\tCan't increment session; session is already maximum length.");

    } else if (this.state.currentMode == "SESSION") {
      console.log("\tCan't increment session; currently in session.");
    } else {
      console.log("\tCan't decrement session; timer is currently running.");
    }
  } // END INCREMENT SESSION

  reset(e) {
    console.log("Resetting timer state...");

    // CLEARING INTERVAL
    clearInterval(this.intervalId);

    // PAUSING AND REWINDING AUDIO
    document.getElementById("beep").pause();
    document.getElementById("beep").currentTime = 0;

    // RESETTING STATE
    this.setState({
      startStopString: "Start",
      timerString: "Timer",
      breakLength: 5,
      sessionLength: 25,
      remainingTime: 1500000,
      currentMode: "RESET" });


    console.log("\tReset > Current mode: " + this.state.currentMode);
  } // END RESET

  toTimeString(ms) {
    // CONVERT TIME FROM MS TO MM:SS
    let hours = Math.floor(ms / (1000 * 60 * 60) % 60);
    let minutes = Math.floor(ms / (1000 * 60) % 60);
    let seconds = Math.floor(ms / 1000 % 60);
    let minuteZero = minutes < 10 ? "0" : "";
    let secondsZero = seconds < 10 ? "0" : "";

    let convertedString = hours == 0 ? minuteZero + minutes + ":" + secondsZero + seconds : "60:00";

    return convertedString;
  } // END TOTIMESTRING

  // FOR SWITCHING BUTTON BETWEEN START/STOP
  switchButton(e) {
    console.log("Switching button...");
    if (this.state.currentMode == "RESET") {
      this.setState({
        currentMode: "SESSION" });

    }
    this.setState({
      startStopString: this.state.startStopString == "Start" ? "Stop" : "Start" });


    // IF TIMER IS STARTED ("START" WAS CLICKED AND CHANGED TO "STOP"), SET INTERVAL
    if (this.state.startStopString == "Stop") {
      this.intervalId = setInterval(this.updateState, 1000);
    } else {
      clearInterval(this.intervalId); // CLEAR INTERVAL IF "STOP" CLICKED
    }
    console.log("\tSwitch button > Current mode: " + this.state.currentMode);
  } // END SWITCHBUTTON

  render() {
    return /*#__PURE__*/(
      React.createElement("div", { id: "clockBox" }, /*#__PURE__*/
      React.createElement("div", { className: "container", id: "break-box" }, /*#__PURE__*/
      React.createElement("div", { id: "break-label" }, "Break Length"), /*#__PURE__*/
      React.createElement("div", { className: "row" }, /*#__PURE__*/
      React.createElement("button", {
        className: "adjustButton",
        id: "break-decrement",
        onClick: this.decrementBreak }, "-"), /*#__PURE__*/



      React.createElement("div", { className: "lengthBox", id: "break-length" },
      this.state.breakLength), /*#__PURE__*/

      React.createElement("button", {
        className: "adjustButton",
        id: "break-increment",
        onClick: this.incrementBreak }, "+"))), /*#__PURE__*/





      React.createElement("div", { className: "container", id: "session-box" }, /*#__PURE__*/
      React.createElement("div", { id: "session-label" }, "Session Length"), /*#__PURE__*/
      React.createElement("div", { className: "row" }, /*#__PURE__*/
      React.createElement("button", {
        className: "adjustButton",
        id: "session-decrement",
        onClick: this.decrementSession }, "-"), /*#__PURE__*/



      React.createElement("div", { className: "lengthBox", id: "session-length" },
      this.state.sessionLength), /*#__PURE__*/

      React.createElement("button", {
        className: "adjustButton",
        id: "session-increment",
        onClick: this.incrementSession }, "+"))), /*#__PURE__*/





      React.createElement("div", { className: "container", id: "timer-box" }, /*#__PURE__*/
      React.createElement("div", { id: "timer-label" }, this.state.timerString), /*#__PURE__*/
      React.createElement("div", { className: "timerBackground" }, /*#__PURE__*/
      React.createElement("div", { className: "row" }, /*#__PURE__*/
      React.createElement("div", { id: "time-left" },
      this.toTimeString(this.state.remainingTime)), /*#__PURE__*/

      React.createElement("div", { className: "container", id: "controlButtons" }, /*#__PURE__*/
      React.createElement("button", {
        className: "controlButton",
        id: "start_stop",
        onClick: this.switchButton }, /*#__PURE__*/

      React.createElement("audio", {
        className: "clip",
        id: "beep",
        src: "https://od.lk/download/MTlfNDYxMjMyNTFf",
        preload: "auto" }),

      this.state.startStopString), /*#__PURE__*/

      React.createElement("button", {
        className: "controlButton",
        id: "reset",
        onClick: this.reset }, "Reset")))))));









  } // END RENDER
} // END CLASS

const root = ReactDOM.createRoot(document.getElementById("main-doc"));
root.render( /*#__PURE__*/React.createElement(SpecialClock, null));