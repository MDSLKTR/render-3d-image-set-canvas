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
                activeImage: '/assets/icons/white.gif',
                activeAngle: 0,
                loading: true,
                windowWidth: window.innerWidth,
                windowHeight: window.innerHeight
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
                        imageData: data.products[product],
                        activeImage: data.products[product][0].src,
                        activeAngle: data.products[product][0].angle,
                        loading: false
                    });

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
            this.hammer = new Hammer(React.findDOMNode(this.refs.canvas));
            this.hammer.get('pan').set({threshold: 0, direction: Hammer.DIRECTION_ALL});
            this.hammer.on('panup', this.panUp);
            this.hammer.on('pandown', this.panDown);
            this.draw();
            // probably needs debounce
            window.addEventListener('resize', this.scale);
            fetchProducts = setInterval(this.getJson('id-12345'), 500);
        },

        componentWillUnmount: function () {
            this.hammer.off('panup', this.panUp);
            this.hammer.off('pandown', this.panDown);
        },

        getContext: function () {
            return React.findDOMNode(this.refs.canvas).getContext('2d');
        },

        tick: function () {
            // Block updates until next animation frame.
            this._frameReady = false;
            this.draw();
            requestAnimationFrame(this.afterTick);
        },

        afterTick: function () {
            // Execute pending draw that may have been scheduled during previous frame
            this._frameReady = true;
            if (this._pendingTick) {
                this._pendingTick = false;
                this.batchedTick();
            }
        },

        batchedTick: function () {
            if (this._frameReady === false) {
                this._pendingTick = true;
                return;
            }
            this.tick();
        },

        scale: function () {
              this.setState({
                  windowWidth: window.innerWidth,
                  windowHeight: window.innerHeight
          });
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

        panDown: function (e) {
            // http://hammerjs.github.io/api/ Event objects
            console.log('Distance traveled: ' + e.distance);
            console.log('X-pos: ' + e.deltaX);
            console.log('Velocity: ' + e.velocityX);
            if (this.state.activeAngle > 0) {
                this.setState({
                    activeAngle: this.state.activeAngle - 30
                });
                this.mapImages(this.state.activeAngle);
            } else {
                this.setState({
                    activeAngle: 330
                });
                this.mapImages(330);
            }
        },
        panUp: function (e) {
            console.log('Distance traveled: ' + e.distance);
            console.log('X-pos: ' + e.deltaX);
            console.log('Velocity: ' + e.velocityX);
            if (this.state.activeAngle < 330) {
                this.setState({
                    activeAngle: this.state.activeAngle + 30
                });
                this.mapImages(this.state.activeAngle);
            } else {
                this.setState({
                    activeAngle: 0
                });
                this.mapImages(0);
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

        draw: function () {
            this.clear();
            this.updateProductImage();
            this.updateText();

            this.batchedTick();
        },

        clear: function () {
            this.getContext().clearRect(0, 0, this.state.windowWidth, this.state.windowHeight);
        },

        updateProductImage: function () {
            var imgPos,
                img;

            img = new Image();
            img.src = this.state.activeImage;

            this.setState({
                imgWidth: img.width,
                imgHeight: img.height
            });

            // center image horizontally
            imgPos = this.state.windowWidth / 2 - this.state.imgWidth / 2;

            this.getContext().drawImage(img, imgPos, 0);
        },

        updateText: function() {
            this.getContext().font = '14pt sans-serif';
            this.getContext().fillText('currently drawn:', 5, 50);
            this.getContext().fillText('Image: ' + this.state.activeImage, 5, 150);
            this.getContext().fillText('Angle: ' + this.state.activeAngle + 'deg', 5, 100);
        },

        render: function () {
            var width = this.state.windowWidth;
            var height = this.state.imgHeight;

            loader = [];
            build = [];
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
            if (this.state.loading === true) {
                loader.push(React.DOM.img({
                    className: 'loader',
                    key: 'loader-img',
                    alt: 'loader',
                    src: '/assets/icons/ajax-loader.svg'
                }));
                loader.push(React.DOM.span({className: 'loader-text', key: 'loader-text'}, 'Loading Product View...'));
            }

            return (
                React.DOM.div({className: 'image-container'},
                    loader,
                    React.DOM.div({className: 'preload'},
                        build
                    ),
                    React.DOM.canvas({
                        className: 'playground',
                        width: width,
                        height: height,
                        ref: 'canvas'
                    }),
                    React.DOM.span({className: 'intro'}, 'Click(Touch) and Drag or click the buttons to rotate'),
                    React.DOM.button({onClick: this.incrementAngle, className: 'button-right'}, 'R'),
                    React.DOM.button({onClick: this.decrementAngle, className: 'button-left'}, 'L')
                )
            );
        }
    });

React.render(React.createElement(imgWrapper),
    document.getElementById('main'));
