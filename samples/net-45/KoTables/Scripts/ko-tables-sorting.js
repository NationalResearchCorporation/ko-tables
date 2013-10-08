// Sorts an array
// sortFunction is the function to determine if an element is <, ==, or > than another
var Sort = function(inputArray) {
    // Utility method to sort by field
    // breakTie is a function that is called in case these fields are equal to break the tie
    var sortByField = function (field, ascending, breakTie) {
        return function (left, right) {
            if (left[field] == right[field]) {
                if (breakTie) {
                    return breakTie(left, right);
                }
                return 0;
            }
            if (ascending) {
                return left[field] < right[field] ? -1 : 1;
            } else {
                return left[field] < right[field] ? 1 : -1;
            }
        }
    }

    // Keep track of the requested sorts
    var sortArray = ko.observableArray();

    // Change the primary sort, pushing the existing primary to secondary, etc.
    // The way ko calls this, this actually needs to return a function that does the work
    var addSort = function (field) {
        return function () {
            // Find the existing sort-order for this column
            var order = null;  // null == no sort requested
            var sorts = sortArray();
            for (var ii = 0; ii < sorts.length; ii++) {
                if (sorts[ii].field == field) {
                    order = sorts[ii].ascending;
                }
            }

            // "Advance" the sort: no sort -> ascending -> descending -> back to no sort
            order = order == null ? true : (order ? false : null);

            // Remove any existing sort for this column
            sortArray.remove(function (item) {
                return item.field == field;
            });

            // Re-add the new sort (if it's not set to no-sort)
            if (order !== null) {
                sortArray.push({ "field": field, "ascending": order });
            }
        }
    }

    var getSort = function (field) {
        return ko.computed(function () {
            var order = null;  // null == no sort requested, false == descending, true == ascending
            var sorts = sortArray();
            for (var ii = 0; ii < sorts.length; ii++) {
                if (sorts[ii].field == field) {
                    order = sorts[ii].ascending;
                }
            }
            return order;
        });
    }

    // Anytime the sorts change, recompute a sort function
    var sortFunc = ko.computed(function () {
        if (sortArray().length == 0) {
            return null;
        }
        var ret = null;
        // Build up a chained list of closures, with the most important sort as the outer closure
        ko.utils.arrayForEach(sortArray(), function (item) {
            // Pass in the previous closure as the breakTie parameter, this leaves the most important sort as the outer function
            ret = sortByField(item.field, item.ascending, ret);
        });
        return ret;
    }, this);

    var outputArray = ko.computed(function () {
        if (sortFunc() == null) {
            return inputArray();
        }
        return inputArray().sort(sortFunc());
    }, this);

    // Public interface
    var self = this;
    self.addSort = addSort;
    self.getSort = getSort;
    self.outputArray = outputArray;
};
