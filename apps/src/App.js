import React, { Component ,Fragment} from "react";
import { Input, Button,notification, message } from 'antd'
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {
        username: "laizq"
      },
      inputValue: "sss"
    };
  }
  WebSocketTest = () => {
    let ws = new WebSocket("ws://localhost:2333");
    this.ws = ws;
    ws.onopen = () => {
      notification.success({message:"连接成功"})
      ws.send(
        JSON.stringify({
          log:"In",
          username:this.state.user.username,
          password:""
        })
      );
    };
    ws.onmessage = (m) => {
      if (m.data === "ping") {
        ws.send("pong");
        return;
      }
      let dat = JSON.parse(m.data);
      console.log(dat)
      console.log(m)
    };
    ws.onclose = () => {
      notification.error({message:"连接断开"})
    };
  }
  send = () => {
    this.ws.send(JSON.stringify({
      type: "message",
      user: this.state.user,
      message: this.state.inputValue,
    }))
  }
  componentDidMount() {
    setTimeout(() => {
      this.WebSocketTest();
    }, 1000);
  }
  render() {
    return (
      <Fragment>
        <Input value={this.state.inputValue} onChange={(e) => { this.setState({ inputValue: e.target.value }) }}></Input>
        <Button type="primary" onClick={this.send}>发送</Button>
      </Fragment>
    );
  }
}

export default App;
