var build,
    i,
    fetchProducts,
    jsonUrl = 'assets/data/set.json',
    loader,
    start,
    end,
    imgWrapper = React.createClass({
        displayName: 'renderImage',
        getInitialState: function () {
            return {
                activeImage: 'assets/icons/white.gif',
                activeAngle: 0,
                loading: true
            };
        },

        getJson: function (product) {
            start = new Date().getTime();
            $.ajax({
                product: product,
                url: jsonUrl,
                dataType: 'json',
                success: function (data) {
                    this.setState({
                        imageData: data[product],
                        activeImage: data[product][0].src,
                        loading: false
                    });

                    //localStorage.setItem('view-data', JSON.stringify(this.state.imageData));
                    //console.log(localStorage.getItem('view-data'));

                    console.log('product images fetched!');
                    clearInterval(fetchProducts);

                    end = new Date().getTime();
                    console.log('product image list fetched in', end - start, 'ms');

                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(jsonUrl, status, err.toString());
                }.bind(this)
            });
        },

        componentDidMount: function () {
            this.hammer = new Hammer(React.findDOMNode(this.refs.hammerHook));
            this.hammer.get('pan').set({threshold: 15});
            this.hammer.on('panright', this.panRight);
            this.hammer.on('panleft', this.panLeft);

            fetchProducts = setInterval(this.getJson('car1'), 500);
        },

        componentWillUnmount: function () {
            this.hammer.off('panright', this.panRight);
            this.hammer.off('panleft', this.panLeft);
        },

        mapImages: function (angle) {
            for (i = 0; i < this.state.imageData.length; i++) {
                if (angle === this.state.imageData[i].angle) {
                    this.setState({
                        activeImage: this.state.imageData[i].src
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
            loader = [];
            build = [];

            if (this.state.loading === true) {
                loader.push(React.DOM.img({
                    className: 'loader',
                    key: 'loader-img',
                    alt: 'loader',
                    src: '/assets/icons/ajax-loader.svg'
                }));
                loader.push(React.DOM.span({className: 'loader-text', key: 'loader-text'}, 'Loading Product View...'));
            }

            if (this.state.imageData) {
                this.state.imageData.forEach(function (image) {
                    build.push(React.DOM.img({
                        key: 'angle-' + image.angle,
                        alt: 'product-view-' + image.angle,
                        src: image.src,
                        'data-angle': image.angle
                    }));
                });
            }

            return (
                React.DOM.div({className: 'image-container'},
                    loader,
                    React.DOM.div({className: 'image-set'},
                        build
                    ),
                    React.DOM.div({ref: 'hammerHook', className: 'image-active'},
                        React.DOM.img({
                            src: this.state.activeImage,
                            alt: 'product-view-' + this.state.activeAngle,
                            'data-angle': this.state.activeAngle
                        })
                    ),
                    React.DOM.span({className: 'intro'}, 'Click(Touch) and Drag or click the buttons to rotate'),
                    React.DOM.button({onClick: this.incrementAngle, className: 'button-right'}, 'R'),
                    React.DOM.button({onClick: this.decrementAngle, className: 'button-left'}, 'L')
                )
            );
        }
    });

React.render(React.createElement(imgWrapper),
    document.getElementById('main'));