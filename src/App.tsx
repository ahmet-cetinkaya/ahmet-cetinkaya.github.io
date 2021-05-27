import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Navbar from './parts/Navbar/Navbar';
import Card from './parts/Card/Card';
import Home from './pages/Home/Home';
import About from './pages/About/About';

import 'bootstrap';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.scss';

import moveBackgroundPositionOnMouseMove from './utils/moveBackgroundPositionOnMouseMove';

interface State {
  bgStyle: {
    backgroundPosition: string;
  };
}

class App extends Component {
  state: State = {
    bgStyle: {
      backgroundPosition: '',
    },
  };

  componentDidMount(): void {
    window.addEventListener('mousemove', (event: MouseEvent) => {
      if (document.body.clientWidth <= 992) return;
      this.setState({
        bgStyle: {
          backgroundPosition: moveBackgroundPositionOnMouseMove(event),
        },
      });
    });
  }

  render(): JSX.Element {
    const { bgStyle } = this.state;

    return (
      <div id='app'>
        <div id='bg' className='d-none d-lg-block'></div>
        <div id='bg-back' style={bgStyle} className='d-none d-lg-block'></div>
        <Router>
          <Card>
            <Navbar />
            <Switch>
              <Route path='/' exact>
                <Home />
              </Route>
              <Route path='/about'>
                <About />
              </Route>
            </Switch>
          </Card>
        </Router>
      </div>
    );
  }
}

export default App;
