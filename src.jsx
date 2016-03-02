import React from 'react';
import classNames from 'classnames';

export default class PureTap extends React.Component {

  static propTypes = {
    component: React.PropTypes.any.isRequired,
    className: React.PropTypes.string.isRequired,
    style: React.PropTypes.object.isRequired,
    action: React.PropTypes.func,
    direction: React.PropTypes.string,
    stopPropagation: React.PropTypes.bool
  };

  static defaultProps = {
    component: 'span',
    className: 'pure-tap',
    style: {},
    direction: 'vertical',
    stopPropagation: true
  };

  constructor(props, context) {
    super(props, context);
    this.state = {on: false};
  }

  componentDidMount() {
    if (!window.ontouchstart) {
      this.windowMouseUp = () => {
        this.mouseDown = false;
      };
      window.addEventListener('mouseup', this.windowMouseUp);
    }
  }

  componentWillUnmount() {
    if (!window.ontouchstart) {
      window.removeEventListener('mouseup', this.windowMouseUp);
    }
  }

  handlers() {
    if (window.ontouchstart === undefined) {
      return {
        onMouseDown: event => {
          this.mouseDown = true;
          this.setState({on: true});
        },
        onMouseUp: event => {
          this.mouseDown = false;
          this.setState({on: false});
          this.props.action && this.props.action();
        },
        onMouseLeave: event => {
          this.mouseDown = false;
          this.setState({on: false});
        }
      }
    } else {
      return {
        onTouchStart: event => {
          this.shouldTriggerAction = true;
          this.setState({on: true});
          this.point = [event.touches[0].clientX, event.touches[0].clientY];
          if (this.props.stopPropagation) {
            event.stopPropagation();
          }
        },
        onTouchMove: event => {
          if (!this.shouldTriggerAction) return;
          if (this.props.stopPropagation) {
            event.stopPropagation();
          }
          if (this.props.direction === 'vertical') {
            if (event.touches[0].clientY !== this.point[1]) {
              this.shouldTriggerAction = false;
              this.setState({on: false});
              this.point = null;
            }
          } else if (this.props.direction === 'horizontal') {
            if (event.touches[0].clientX !== this.point[0]) {
              this.shouldTriggerAction = false;
              this.setState({on: false});
              this.point = null;
            }
          } else if (this.props.direction === 'none') {
            if (event.touches[0].clientX !== this.point[0] || event.touches[0].clientY !== this.point[1]) {
              this.shouldTriggerAction = false;
              this.setState({on: false});
              this.point = null;
            }
          }
        },
        onTouchEnd: event => {
          if (this.shouldTriggerAction) {
            this.props.action && this.props.action();
          }
          if (this.props.stopPropagation) {
            event.stopPropagation();
          }
          this.shouldTriggerAction = false;
          this.setState({on: false});
          this.point = null;
        },
        onTouchCancel: event => {
          this.shouldTriggerAction = false;
          this.setState({on: false});
          this.point = null;
        }
      }
    }
  }

  render() {
    let {component, style} = this.props;
    let className = classNames(this.props.className, this.state);
    let props = {style, className, ...::this.handlers()};
    return React.createElement(component, props, this.props.children);
  }
}