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
    var addSort = function (field, ascending) {
        return function () {
            sortArray.remove(function (item) {
                return item.field == field;
            });
            sortArray.push({ "field": field, "ascending": ascending });
        }
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
    self.outputArray = outputArray;
};
