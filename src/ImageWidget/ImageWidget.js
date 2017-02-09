/**
 * @author Christian Brel <ch.brel@gmail.com>
 */

// Import JQuery
import $ from 'jquery/dist/jquery.min';

import TUIOWidget from 'tuiomanager/core/TUIOWidget';
import {WINDOW_WIDTH, WINDOW_HEIGHT} from 'tuiomanager/core/constants';
import {radToDeg} from 'tuiomanager/core/helpers';
var mathjs = require('mathjs');

/**
 * Main class to manage ImageWidget.
 *
 * Note:
 * It's dummy implementation juste to give an example
 * about how to use TUIOManager framework.
 *
 * @class ImageWidget
 * @extends TUIOWidget
 */
class ImageWidget extends TUIOWidget {
    /**
     * ImageWidget constructor.
     *
     * @constructor
     * @param {number} x - ImageWidget's upperleft coin abscissa.
     * @param {number} y - ImageWidget's upperleft coin ordinate.
     * @param {number} width - ImageWidget's width.
     * @param {number} height - ImageWidget's height.
     */
    constructor(x, y, width, height, imgSrc, projectTags) {
        super(x, y, width, height);

        this._lastTouchesValues = {};
        this._lastTagsValues = {};

        this._projectTags = projectTags;

        this._domElem = $('<img>');
        this._domElem.attr('src', imgSrc);
        this._domElem.css('width', `${width}px`);
        this._domElem.css('height', `${height}px`);
        this._domElem.css('position', 'absolute');
        this._domElem.css('left', `${x}px`);
        this._domElem.css('top', `${y}px`);

        this._touchNb = 0;
        this._lastTouchValue = {};
        this._firstTouchValue = {};
        this._initialDistance = 0;
		this._angle = 0;
		this._initialAngle = 0;
    }

    /**
     * ImageWidget's domElem.
     *
     * @returns {JQuery Object} ImageWidget's domElem.
     */
    get domElem() {
        return this._domElem;
    }

    /**
     * Call after a TUIOTouch creation.
     *
     * @method onTouchCreation
     * @param {TUIOTouch} tuioTouch - A TUIOTouch instance.
     */
    onTouchCreation(tuioTouch) {
        super.onTouchCreation(tuioTouch);
        if (this.isTouched(tuioTouch.x, tuioTouch.y)  && this._touchNb <=2) {
            this._touchNb += 1;
            this._lastTouchesValues = {
                ...this._lastTouchesValues,
                [tuioTouch.id]: {
                    x: tuioTouch.x,
                    y: tuioTouch.y,
                    nb: this._touchNb,
                },
            };

            if(this._touchNb == 1){
                this._firstTouchValue = this._lastTouchesValues[tuioTouch.id];
				console.log('touchCreation1');


            }
            if(this._touchNb == 2){
                this._initialDistance = Math.sqrt(Math.pow(tuioTouch.y-this._firstTouchValue.y,2)+Math.pow(tuioTouch.x-this._firstTouchValue.x,2));
				this._initialAngle = Math.atan2(tuioTouch.y - this._firstTouchValue.y,
                        tuioTouch.x - this._firstTouchValue.x) * 180 / Math.PI;
						console.log('touchCreation2');
            }
            
        }
    }

    onTouchDeletion(tuioTouch) {
        super.onTagDeletion(tuioTouch);
        this._touchNb -= 1;
		if(this._touchNb <= 0){
			this._touchNb = 0;
		}
		this._initialAngle = 0;
		this._initialDistance = 0;
		console.log(this._touchNb);
    }

    /**
     * Call after a TUIOTouch update.
     *
     * @method onTouchUpdate
     * @param {TUIOTouch} tuioTouch - A TUIOTouch instance.
     */
    onTouchUpdate(tuioTouch) {
        if (typeof (this._lastTouchesValues[tuioTouch.id]) !== 'undefined') {
            if (this._lastTouchesValues[tuioTouch.id].nb === 1) {
                this._lastTouchValue = this._lastTouchesValues[tuioTouch.id];
                const diffX = tuioTouch.x - this._lastTouchValue.x;
                const diffY = tuioTouch.y - this._lastTouchValue.y;

                let newX = this.x + diffX;
                let newY = this.y + diffY;

                if (newX < 0) {
                    newX = 0;
                }

                if (newX > (WINDOW_WIDTH - this.width)) {
                    newX = WINDOW_WIDTH - this.width;
                }

                if (newY < 0) {
                    newY = 0;
                }

                if (newY > (WINDOW_HEIGHT - this.height)) {
                    newY = WINDOW_HEIGHT - this.height;
                }


                this.moveTo(newX, newY);

                this._lastTouchesValues = {
                    ...this._lastTouchesValues,
                    [tuioTouch.id]: {
                        x: tuioTouch.x,
                        y: tuioTouch.y,
                        nb: this._lastTouchValue.nb,
                    },
                };
            }
            if (this._lastTouchesValues[tuioTouch.id].nb == 2) {

                const currentTouchValue = this._lastTouchesValues[tuioTouch.id];

                this._angle = Math.atan2(this._lastTouchValue.y - currentTouchValue.y,
                        this._lastTouchValue.x - currentTouchValue.x) * 180 / Math.PI + this._angle + 180;

				var rotation = Math.atan2(this._lastTouchValue.y - currentTouchValue.y,
                        this._lastTouchValue.x - currentTouchValue.x) * 180 / Math.PI + this._initialAngle + 180;
						
                var ratio = Math.sqrt(Math.pow(tuioTouch.y-this._lastTouchValue.y,2)+Math.pow(tuioTouch.x-this._lastTouchValue.x,2))/this._initialDistance;

                this.rotateResize(rotation, ratio);
				
				console.log(ratio);
				console.log(this._width);
				console.log(this._height);

                this._lastTouchesValues = {
                    ...this._lastTouchesValues,
                    [tuioTouch.id]: {
                        x: tuioTouch.x,
                        y: tuioTouch.y,
                        nb: currentTouchValue.nb,
                    },
                };
            }
        }
    }

    /**
     * Call after a TUIOTag creation.
     *
     * @method onTagCreation
     * @param {TUIOTag} tuioTag - A TUIOTag instance.
     */
    onTagCreation(tuioTag) {
        super.onTagCreation(tuioTag);
        if (this.isTouched(tuioTag.x, tuioTag.y)) {
            this._lastTagsValues = {
                ...this._lastTagsValues,
                [tuioTag.id]: {
                    x: tuioTag.x,
                    y: tuioTag.y,
                },
            };
        }
    }

    /**
     * Call after a TUIOTag update.
     *
     * @method onTagUpdate
     * @param {TUIOTag} tuioTag - A TUIOTag instance.
     */
    onTagUpdate(tuioTag) {
        if (typeof (this._lastTagsValues[tuioTag.id]) !== 'undefined') {
            
        }
    }

    /**
     * Move ImageWidget.
     *
     * @method moveTo
     * @param {string/number} x - New ImageWidget's abscissa.
     * @param {string/number} y - New ImageWidget's ordinate.
     * @param {number} angle - New ImageWidget's angle.
     */
    moveTo(x, y, angle = null) {
        this._x = x;
        this._y = y;
        this._domElem.css('left', `${x}px`);
        this._domElem.css('top', `${y}px`);
        if (angle !== null) {
            this._domElem.css('transform', `rotate(${angle}deg)`);
        }
    }
    rotateResize(rotation, ratio){
		this._domElem.css('transform', `scale(${ratio},${ratio}) rotate(${rotation}deg)`);
		this._width = this._width*ratio;
		this._height = this._height*ratio;
    }
    resize(ratio){
        this._domElem.css('transform', `scale(${ratio},${ratio})`);
    }

    isTouched(x,y){

        var centerX = this._x+this._width/2;
        var centerY = this._y+this._height/2;

        var Ox = this._width/2

        var x1 = (this._x-centerX)*Math.cos(this._angle) - (this._y-centerY)*Math.sin(this._angle) + centerX;
        var y1 = (this._x-centerX)*Math.sin(this._angle) + (this._y-centerY)*Math.cos(this._angle) + centerY;

        var x2 = (this._x+this._width-centerX)*Math.cos(this._angle) - (this._y-centerY)*Math.sin(this._angle) + centerX;
        var y2 = (this._x+this._width-centerX)*Math.sin(this._angle) + (this._y-centerY)*Math.cos(this._angle) + centerY;

        var x3 = (this._x+this._width-centerX)*Math.cos(this._angle) - (this._y+this._height-centerY)*Math.sin(this._angle) + centerX;
        var y3 = (this._x+this._width-centerX)*Math.sin(this._angle) + (this._y+this._height-centerY)*Math.cos(this._angle) + centerY;

        var x4 = (this._x-centerX)*Math.cos(this._angle) - (this._y+this._height-centerY)*Math.sin(this._angle) + centerX;
        var y4 = (this._x-centerX)*Math.sin(this._angle) + (this._y+this._height-centerY)*Math.cos(this._angle) + centerY;



        return (0 < mathjs.dot([x-x1,y-y1],[x2-x1,y2-y1])
            && mathjs.dot([x-x1,y-y1],[x2-x1,y2-y1]) < mathjs.dot([x2-x1,y2-y1],[x2-x1,y2-y1])
            && 0 < mathjs.dot([x-x1,y-y1],[x4-x1,y4-y1])
            && mathjs.dot([x-x1,y-y1],[x4-x1,y4-y1]) < mathjs.dot([x4-x1,y4-y1],[x4-x1,y4-y1]));

        //return (x >= this._x && x <= this._x + newWidth && y >= this._y && y <= this._y + newHeight);
    }
}

export default ImageWidget;
