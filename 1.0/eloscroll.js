/*!
 eloScroll v1.0
 (c) 2015-2016 Ivan Filho http://ivanfilho.com
 License: LGPL
 */

var
    eloscroll = function(element) {
        /*
         * Initialization
         */
        var self = this;

        /*
         * Settings
         */
        settings = {
            wheelSpeed : 20
        };

        /*
         * Movement
         */
        movement = {
            enabled: false,
            mouse: false,
            mouseOffset: 0,
            touch: false,
            touchOffset: 0
        }

        /*
         * Viewport (.eloscroll)
         */
        $viewport = element;

        with ($viewport.style) {
            position = 'relative';
            overflow = 'hidden';
        }

        /*
         * Scrollbar (.bar)
         */
        $bar = document.createElement('div');

        with ($bar) {
            className = 'bar';

            with (style) {
                display = 'none';
                position = 'absolute';
                boxSizing = 'padding-box';
                top = 0;
                right = 0;
                bottom = 0;
            }
        }

        $viewport.appendChild($bar);

        /*
         * Scrollbutton (.button)
         */
        $button = document.createElement('div');

        with ($button) {
            className = 'button';

            with (style) {
                position = 'absolute';
                boxSizing = 'border-box';
                top = 0;
                left = 0;
                right = 0;
            }
        }

        $bar.appendChild($button);

        /*
         * Margin detection
         */

        getMargin = function() {
            var css = document.defaultView.getComputedStyle($button, '');
            return parseInt(css.getPropertyValue('margin-top')) + parseInt(css.getPropertyValue('margin-bottom'));
        }

        /*
         * Resizing detection
         */
        window.setInterval(function() {
            var viewHeight  = $viewport.clientHeight;
            var totalHeight = $viewport.scrollHeight;
            movement.enabled = viewHeight < totalHeight;
            if (movement.enabled) {
                var newHeight = viewHeight * $bar.clientHeight / totalHeight;
                with ($button) {
                    style.height = (newHeight - getMargin()) + 'px';
                }
                $bar.style.display = 'block';
            } else {
                $bar.style.display = 'none';
            }
        }, 10);

        /*
         * Commands
         */

        set = function(top) {
            $button.style.top = top + 'px';
            var content = $viewport.childNodes;
            for (var i = 0; i < content.length; i++) {
                with (content[i]) {
                    if (typeof classList !== 'undefined' && classList.contains('scrollable')) {
                        style.position = 'relative';
                        style.top = -top + 'px';
                    }
                }
            }
        }

        move = function(y) {
            if (!movement.enabled) {
                set(0);
            } else {
                var maxY = $bar.clientHeight - parseInt($button.style.height) - getMargin();
                if (y < 0) set(0);
                else if (y > maxY) set(maxY);
                else set(y);
            }
        }

        /*
         * Mouse events
         */

        mouseoverEvent = function() {
            this.classList.add('hover');
        }

        mouseleaveEvent = function() {
            this.classList.remove('hover');
        }

        $viewport.addEventListener('mouseover', mouseoverEvent);
        $bar.addEventListener('mouseover', mouseoverEvent);
        $button.addEventListener('mouseover', mouseoverEvent);

        $viewport.addEventListener('mouseleave', mouseleaveEvent);
        $bar.addEventListener('mouseleave', mouseleaveEvent);
        $button.addEventListener('mouseleave', mouseleaveEvent);

        document.addEventListener('mousedown', function(event) {
            if (event.target == $bar) {
                // Bar
                $bar.classList.add('active');
            } else if (event.target == $button) {
                // Button
                $bar.classList.add('active');
                $button.classList.add('active');
                movement.mouse = true;
                movement.mouseOffset = event.clientY - $button.getBoundingClientRect().top;
            };
        });

        document.addEventListener('mouseup', function() {
            $bar.classList.remove('active');
            $button.classList.remove('active');
            movement.mouse = false;
        });

        document.addEventListener('mousemove', function(event) {
            if (movement.mouse) {
                var posInWindow = event.clientY;
                var barPosition = $bar.getBoundingClientRect().top;
                move(posInWindow - barPosition - movement.mouseOffset);
            }
        });

        $viewport.addEventListener('wheel', function(event) {
            move(parseInt($button.style.top) + event.deltaY * settings.wheelSpeed);
        });

        /*
         * Touch events
         */

        $viewport.addEventListener('touchstart', function(event) {
            if (event.touches.length == 1) {
                movement.touch = true;
                movement.touchOffset = event.touches[0].pageY;
            }
        });

        $viewport.addEventListener('touchend', function(event) {
            movement.touch = false;
        })

        $viewport.addEventListener('touchmove', function(event) {
            if (movement.touch) {
                var delta = movement.touchOffset - event.touches[0].pageY;
                move(parseInt($button.style.top) + delta);
                movement.touchOffset = event.touches[0].pageY;
            }
        });
    };

/*
 * Events: Startup
 */
document.addEventListener('DOMContentLoaded', function(){
    var autoload = document.querySelectorAll('.eloscroll');
    for (var i = 0; i < autoload.length; i++) {
        eloscroll(autoload[i]);
    }
}, false);
