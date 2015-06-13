var build,
    i,
    fetchProducts,
    fetchProduct,
    productsUrl = 'assets/data/productlist.json',
    productUrl = 'assets/data/',
    loader,
    start,
    end,
    createUrl,
    imgWrapper = React.createClass({
        displayName: 'renderImage',
        getInitialState: function () {
            return {
                activeImage: '/assets/icons/white.gif',
                activeAngle: 0,
                loading: true,
                windowWidth: document.documentElement.clientWidth,
                windowHeight: document.documentElement.clientHeight,
                inputText: '',
                x: document.documentElement.clientWidth / 2,
                y: document.documentElement.clientHeight / 5
            };
        },

        getProducts: function () {
            start = new Date().getTime();
            $.ajax({
                url: productsUrl,
                dataType: 'json',
                success: function (data) {
                    this.setState({
                        loading: false,
                        products: data.products
                    });

                    console.log('products fetched!');
                    clearInterval(fetchProducts);

                    end = new Date().getTime();
                    console.log('product list fetched in', end - start, 'ms');

                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(productsUrl, status, err.toString());
                }.bind(this)
            });
        },

        getProduct: function (id) {
            createUrl = productUrl + this.state.products[id].url;
            start = new Date().getTime();
            $.ajax({
                url: createUrl,
                dataType: 'json',
                success: function (data) {
                    this.setState({
                        loading: false,
                        productId: data.product,
                        productData: data.product.data,
                        activeImage: data.product.data[0].src,
                        activeAngle: data.product.data[0].angle
                    });

                    console.log('product images fetched!');
                    clearInterval(fetchProduct);

                    end = new Date().getTime();
                    console.log('product image list fetched in', end - start, 'ms');

                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(createUrl, status, err.toString());
                }.bind(this)
            });
        },

        componentDidMount: function () {
            this.hammer = new Hammer(React.findDOMNode(this.refs.canvas));
            this.hammer.get('pan').set({threshold: 0, direction: Hammer.DIRECTION_ALL});
            this.hammer.on('panleft', this.panLeft);
            this.hammer.on('panright', this.panRight);
            //this.hammer.on('panstart panmove', this.positionElement);
            this.draw();
            fetchProducts = setInterval(this.getProducts, 500);


            // probably needs debounce
            window.addEventListener('resize', this.scale);
        },

        handleSelect: function() {
            var newValue = this.refs.select.getDOMNode().value;

            fetchProduct = setInterval(this.getProduct(newValue), 500);

            //this.setState({products: newValue});
        },

        componentWillUnmount: function () {
            this.hammer.off('panleft', this.panLeft);
            this.hammer.off('panright', this.panRight);
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
                windowWidth: document.documentElement.clientWidth,
                windowHeight: document.documentElement.clientHeight
            });
        },

        mapImages: function (angle) {
            if (this.state.productData) {
                for (i = 0; i < this.state.productData.length; i++) {
                    if (angle === this.state.productData[i].angle) {
                        this.setState({
                            activeImage: this.state.productData[i].src
                        });

                        console.log('currently drawn:');
                        console.log('Image: ' + this.state.productData[i].src);
                        console.log('Angle: ' + angle);
                    }
                }
            }
        },

        panRight: function (e) {
            // http://hammerjs.github.io/api/ Event objects
            //console.log('Distance traveled: ' + e.distance);
            //console.log('X-pos: ' + e.deltaX);
            //console.log('Velocity: ' + e.velocityX);
            if (this.state.activeAngle > 0) {
                this.setState({
                    activeAngle: this.state.activeAngle - 24
                });
                this.mapImages(this.state.activeAngle);
            } else {
                this.setState({
                    activeAngle: 360
                });
                this.mapImages(360);
            }
        },
        panLeft: function (e) {
            //console.log('Distance traveled: ' + e.distance);
            //console.log('X-pos: ' + e.deltaX);
            //console.log('Velocity: ' + e.velocityX);
            if (this.state.activeAngle < 360) {
                this.setState({
                    activeAngle: this.state.activeAngle + 24
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
            if (this.state.activeAngle < 360) {
                this.setState({
                    activeAngle: this.state.activeAngle + 24
                });
                this.mapImages(this.state.activeAngle + 24);
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
                    activeAngle: this.state.activeAngle - 24
                });
                this.mapImages(this.state.activeAngle - 24);
            } else {
                this.setState({
                    activeAngle: 360
                });
                this.mapImages(360);
            }
        },

        draw: function () {
            this.clear();
            this.updateProductImage();
            this.updateProductText();
            this.batchedTick();
        },

        clear: function () {
            this.getContext().clearRect(0, 0, this.state.windowWidth, this.state.windowHeight);
        },

        updateProductImage: function () {
            var img;

            img = new Image();
            img.src = this.state.activeImage;

            this.setState({
                imgWidth: img.width,
                imgHeight: img.height
            });

            this.getContext().drawImage(img, 0, 0);
        },

        handleInput: function (e) {
            var input = e.target.value;
            this.setState({inputText: input});
        },


        positionElement: function (e) {
            //console.log(e);
            //console.log(e.srcEvent.pageX);
            //console.log(e.deltaY);
          this.setState({
              x: e.srcEvent.pageX,
              y: e.srcEvent.pageY
          });
        },

        updateProductText: function () {
            this.getContext().save();

            this.getContext().textAlign = 'center';
            this.getContext().font = '14pt sans-serif';
            this.getContext().fillStyle = '#f50';
            this.getContext().fillText(this.state.inputText, this.state.x, this.state.y);

            this.getContext().restore();
        },

        render: function () {
            var width = this.state.imgWidth,
                height = this.state.imgHeight,
                products;

            loader = [];
            build = [];
            products = [];

            products.push(React.DOM.option({
                key: products.key,
                value: 'select',
                style: {display: 'none'}
            }, 'Select Product'
            ));

            if (this.state.products) {
                this.state.products.forEach(function (product) {
                    products.push(React.DOM.option({
                        key: product.key,
                        value: product.id
                    }, product.slug));
                });
            }


            if (this.state.productData) {
                this.state.productData.forEach(function (image) {
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
                    //React.DOM.input({
                    //    className: 'text-overlay',
                    //    value: this.state.inputText,
                    //    onChange: this.handleInput
                    //}, 'Enter some Text'),
                    React.DOM.select({
                        className: 'select-product',
                        ref: 'select',
                        onChange: this.handleSelect
                    }, products),
                    React.DOM.button({onClick: this.incrementAngle, className: 'button-right'}, 'R'),
                    React.DOM.button({onClick: this.decrementAngle, className: 'button-left'}, 'L')
                )
            );
        }
    });

React.render(React.createElement(imgWrapper),
    document.getElementById('main'));
