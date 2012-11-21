K2.Bar = function(args) {
    if (arguments.length) {
        this.getready(args);
    }
};

K2.extend(K2.Bar, K2.UIElement);

K2.Bar.prototype.getready = function(args) {

    // Call the constructor from the superclass.
    K2.Bar.superclass.getready.call(this, args);

    this.values = {'barPos' : [],
                   'dragStart': [],
                   'dragEnd': []
                   };
    this.defaultSlot = 'barPos';

    this.setWidth(args.width);
    this.setHeight(args.height);
    this.orientation = args.orientation || 0;
    this.barColor = args.barColor || 'black';
    this.thickness = args.thickness || 1;

};

// This methods returns true if the point given belongs to this element.
K2.Bar.prototype.isInROI = function(x, y) {
    if ((x > this.ROILeft) && (y > this.ROITop)) {
        if ((x < (this.ROILeft + this.ROIWidth)) && (y < (this.ROITop + this.ROIHeight))) {
            return true;
        }
    }
    return false;
};

K2.Bar.prototype.tap = K2.Bar.prototype.drag = function(curr_x, curr_y) {

    var to_set = 0,
        ret = {};

    
    if (this.isInROI(curr_x, curr_y)) {

        var tempValue = this.values.barPos;
        var retVal = [];

        if (this.orientation === 0) {
            retVal = [curr_x, tempValue[1]];
        }

        else if (this.orientation === 1) {
            retVal = [tempValue[0], curr_y];
        }

        else {
            console.error('orientation invalid, this will probably break something');
        }

		ret = {'slot' : 'barPos', 'value' : retVal};
        return ret;
    }
  

    // Action is void, button was upclicked outside its ROI or never downclicked
    // No need to trigger anything, ignore this event.
    return undefined;

};

K2.Bar.prototype.dragend = K2.Bar.prototype.swipe = function(curr_x, curr_y) {
    if (this.isInROI(curr_x, curr_y)) {
        ret = {'slot' : 'dragEnd', 'value' : [curr_x, curr_y]};
        return ret;
    }
    else {
        // equivalent to mouseOut + triggered === true
        ret = {'slot' : 'dragEnd', 'value' : [curr_x, curr_y]};
        return ret;
    }
};

K2.Bar.prototype.dragstart = function(curr_x, curr_y) {
    if (this.isInROI(curr_x, curr_y)) {
        ret = {'slot' : 'dragStart', 'value' : [curr_x, curr_y]};
        return ret;
    }
};

K2.Bar.prototype.setValue = function(slot, value) {

	console.log('Setting ' + slot + ' to ' + value);

    if (slot == 'barPos') {
        if (value[0] <= this.width) {
            this.values.barPos[0] = value[0];
        }
        if (value[1] <= this.height) {
            this.values.barPos[1] = value[1];
        }
    }
    else this.values[slot] = value;
};

K2.Bar.prototype.refresh_CANVAS2D = function(engine) {
    
    if (this.isVisible === true) {

    var context = engine.context;
        context.lineWidth = this.thickness;
        context.strokeStyle = this.barColor;

	    // Draw the bar
	    //TODO there must be a less-repetitive way of handling orientations
	    
        context.beginPath();
	    
        if (this.orientation === 0) {
            var x = this.xOrigin + this.values.barPos[0];
            context.moveTo(x, this.yOrigin + this.height);
			context.lineTo(x, this.yOrigin);
		}
		else if (this.orientation === 1) {
            context.moveTo(this.xOrigin + this.width, this.yOrigin + this.values.barPos[1]);
			context.lineTo(this.xOrigin, this.yOrigin + this.values.barPos[1]);
		}
		
		context.stroke();
		context.closePath();  
    }
    
};
