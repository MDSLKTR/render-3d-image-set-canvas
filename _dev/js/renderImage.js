var imgWrapper = React.createClass({
    displayName: 'renderImage',
    getInitialState: function () {
        return {
            activeImage: 'assets/images/159--00000.png',
            activeAngle: 0,
            step: 0
        };
    },

    componentDidMount: function () {
        this.hammer = new Hammer(React.findDOMNode(this.refs.hammerHook));
        this.hammer.get('pan').set({threshold: 15});
        this.hammer.on('panright', this.panRight);
        this.hammer.on('panleft', this.panLeft);
    },

    componentWillUnmount: function () {
        this.hammer.off('panright', this.panRight);
        this.hammer.off('panleft', this.panLeft);
    },

    mapImages: function (angle) {
        var imageArray = [
                ['assets/images/159--00000.png', 0],
                ['assets/images/159--00003.png', 30],
                ['assets/images/159--00006.png', 60],
                ['assets/images/159--00009.png', 90],
                ['assets/images/159--00012.png', 120],
                ['assets/images/159--00015.png', 150],
                ['assets/images/159--00018.png', 180],
                ['assets/images/159--00021.png', 210],
                ['assets/images/159--00024.png', 240],
                ['assets/images/159--00027.png', 270],
                ['assets/images/159--00030.png', 300],
                ['assets/images/159--00033.png', 330]
            ],
            i;

        for (i = 0; i < imageArray.length; i++) {
            if (angle === imageArray[i][1]) {
                this.setState({
                    activeImage: imageArray[i][0]
                });
            }
        }
    },

    panLeft: function (e) {
        // http://hammerjs.github.io/api/ Event objects
        console.log('Distance traveled: ' + e.distance);
        console.log('X-pos: ' + e.deltaX);
        console.log('Velocity: ' + e.velocityX);
        if (this.state.activeAngle > 0) {
            this.setState({
                activeAngle: this.state.activeAngle - 30
            });
            this.mapImages(this.state.activeAngle - 30);
        } else {
            this.setState({
                activeAngle: 330
            });
            this.mapImages(330);
        }
    },
    panRight: function (e) {
        console.log('Distance traveled: ' + e.distance);
        console.log('X-pos: ' + e.deltaX);
        console.log('Velocity: ' + e.velocityX);
        if (this.state.activeAngle > 0) {
            this.setState({
                activeAngle: this.state.activeAngle - 30
            });
            this.mapImages(this.state.activeAngle - 30);
        } else {
            this.setState({
                activeAngle: 330
            });
            this.mapImages(330);
        }
    },

    incrementAngle: function () {
        if (this.state.activeAngle < 330) {
            this.setState({
                activeAngle: this.state.activeAngle + 30
            });
            this.mapImages(this.state.activeAngle + 30);
        } else {
            this.setState({
                activeAngle: 0
            });
            this.mapImages(0);
        }
    },

    decrementAngle: function () {
        if (this.state.activeAngle > 0) {
            this.setState({
                activeAngle: this.state.activeAngle - 30
            });
            this.mapImages(this.state.activeAngle - 30);
        } else {
            this.setState({
                activeAngle: 330
            });
            this.mapImages(330);
        }
    },

    render: function () {
        var imageArray = [
                ['assets/images/159--00000.png', 0],
                ['assets/images/159--00003.png', 30],
                ['assets/images/159--00006.png', 60],
                ['assets/images/159--00009.png', 90],
                ['assets/images/159--00012.png', 120],
                ['assets/images/159--00015.png', 150],
                ['assets/images/159--00018.png', 180],
                ['assets/images/159--00021.png', 210],
                ['assets/images/159--00024.png', 240],
                ['assets/images/159--00027.png', 270],
                ['assets/images/159--00030.png', 300],
                ['assets/images/159--00033.png', 330]
            ],
            build = [];

        imageArray.forEach(function (image) {
            build.push(React.DOM.img({key: image.key, src: image[0], 'data-angle': image[1]}));
        });

        return (
            React.DOM.div({className: 'image-preload'},
                build,
                React.DOM.span({className: 'intro'}, 'Click(Touch) and Drag or click the buttons to rotate'),
                React.DOM.button({onClick: this.incrementAngle, className: 'button-right'}, 'R'),
                React.DOM.button({onClick: this.decrementAngle, className: 'button-left'}, 'L'),
                React.DOM.div({ref: 'hammerHook', className: 'active'},
                    React.DOM.img({src: this.state.activeImage, 'data-angle': this.state.activeAngle})
                )
            )
        );
    }
});

React.render(React.createElement(imgWrapper),
    document.getElementById('container'));