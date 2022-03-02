class PressureInputForm extends React.Component {
  render() {
    return (
      <form>
        <input type="text"/><input type="submit" value="実行"/>
      </form>
    )
  }
}

ReactDOM.render(<PressureInputForm/>, document.getElementById('input'));

function tick() {
  const element = (
    <div id="timer">
      <h3>It is {new Date().toLocaleTimeString()}.</h3>
    </div>
  );
  ReactDOM.render(element, document.getElementById('timer'));
}

setInterval(tick, 1000);
