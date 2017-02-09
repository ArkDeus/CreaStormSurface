

// Import JQuery
import $ from 'jquery/dist/jquery.min';

import TUIOWidget from 'tuiomanager/core/TUIOWidget';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from 'tuiomanager/core/constants';
import { radToDeg } from 'tuiomanager/core/helpers';

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
class TagListWidget extends TUIOWidget {
    /**
     * ImageWidget constructor.
     *
     * @constructor
     * @param {number} x - ImageWidget's upperleft coin abscissa.
     * @param {number} y - ImageWidget's upperleft coin ordinate.
     * @param {number} width - ImageWidget's width.
     * @param {number} height - ImageWidget's height.
     */
    constructor(x, y, width, height) {
        super(x, y, width, height);

        this._lastTagsValues = {};

        this._domElem=$();
        this._domElem.css('position', 'absolute');
        this._domElem.css('left', `${x}px`);
        this._domElem.css('top', `${y}px`);
        this._domElem.css('visibility','hidden');
        this._selectCaliber=10;
        this._selectCounter=0;
        this._previousAngle=0;
    }

    /**
     * ImageWidget's domElem.
     *
     * @returns {JQuery Object} ImageWidget's domElem.
     */
    get domElem() { return this._domElem; }

    /**
     * Call after a TUIOTouch creation.
     *
     * @method onTouchCreation
     * @param {TUIOTouch} tuioTouch - A TUIOTouch instance.
     */


    /**
     * Call after a TUIOTouch update.
     *
     * @method onTouchUpdate
     * @param {TUIOTouch} tuioTouch - A TUIOTouch instance.
     */


    /**
     * Call after a TUIOTag creation.
     *
     * @method onTagCreation
     * @param {TUIOTag} tuioTag - A TUIOTag instance.
     */
    onTagCreation(tuioTag){
        super.onTagCreation(tuioTag);
        if (this.isTouched(tuioTag.x, tuioTag.y)) {
            console.log(tuioTag.id);
            this._lastTagsValues = {
                ...this._lastTagsValues,
                [tuioTag.id]: {
                x: tuioTag.x,
                    y: tuioTag.y,
            },
        };
            var x = tuioTag.x;
            var y = tuioTag.y;
            var angle = radToDeg(tuioTag.angle);
            this._previousAngle=angle;
            console.log("tagcreation x : "+x+" y :"+y);
            this._domElem.css('visibility','visible');
            this._domElem.css('top', `${y}px`);
            this._domElem.css('left', `${x}px`);
            this._domElem.css('transform', `rotate(${angle}deg)`);
        }
    }

    /**
     * Call after a TUIOTag update.
     *
     * @method onTagUpdate
     * @param {TUIOTag} tuioTag - A TUIOTag instance.
     */
    onTagUpdate(tuioTag) {
        //console.log("tag update");
        if (typeof (this._lastTagsValues[tuioTag.id]) !== 'undefined') {
            const lastTagValue = this._lastTagsValues[tuioTag.id];
            const diffX = tuioTag.x - lastTagValue.x;
            const diffY = tuioTag.y - lastTagValue.y;

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
            var angle = radToDeg(tuioTag.angle);
            this.moveTo(tuioTag.x, tuioTag.y, angle);
            if (angle != this._previousAngle){
                this._selectCounter  +=1;
                this._previousAngle=angle;
            }
            if(this._selectCounter > this._selectCaliber){
                console.log("select next item !");
                this.selectNextItem();
                this._selectCounter=0;
            }


            this._lastTagsValues = {
                ...this._lastTagsValues,
                [tuioTag.id]: {
                x: tuioTag.x,
                    y: tuioTag.y,
            },
        };
        }
    }

    onTagDeletion(tuioTagId){
        super.onTagDeletion(tuioTagId);
        this._domElem.css('visibility','hidden');
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

        //this._x = x;
        //this._y = y;
        //console.log("move x :"+x+" y : "+y);
        this._domElem.css('left', `${x}px`);
        this._domElem.css('top', `${y}px`);
        if (angle !== null) {
            //this._domElem.css('transform', `rotate(${angle}deg)`);
        }
    }

    selectNextItem(){
        var currentElement = $(".selected");
        if(currentElement.next("li").length>0){
            currentElement.next("li").addClass("selected");
            currentElement.removeClass("selected");
        }
        else {
            currentElement.removeClass("selected");

            $('li:first-child',currentElement.parents('ul')).addClass("selected");
        }
    }
}

export default TagListWidget;
