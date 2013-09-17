
// Filters out items that don't contain every word in a filter expression
// inputArray is an observableArray of objects
// leaves results in outputArray
var ColumnFilter = function (inputArray) {
    // This is a basic AND filter
    //   each item will be filtered if it doesn't contain each of the words
    var filterMatches = function (filterExpression, value) {
        filterExpression = filterExpression.toLowerCase()
        value = String(value).toLowerCase()
        var words = filterExpression.split(" ");
        var result = true;
        for (var ii = 0; ii < words.length; ii++) {
            var word = words[ii];
            // If this word isn't blank, and can't be found,
            //   then filter out the item
            if (word != "" &&
                value.indexOf(word) == -1) {
                result = false;
            }
        }
        return result;
    };

    // The list of current filters
    // This is an internal observable
    var filters = ko.observableArray([]);
    // Gets the observable string representing the filter for a specific column
    var filterFor = function (name) {
        var ret = null;
        // Try and find the existing observable string by column name
        for (var ii = 0; ii < filters().length; ii++) {
            var filter = filters()[ii];
            if (filter.name == name) {
                // We found it
                ret = filter;
            }
        }
        // If we can't find it, put a new entry in
        if (ret == null) {
            ret = { "name": name, "filterExpression": ko.observable("") }
            filters.push(ret);
        }
        return ret.filterExpression;
    };

    // Removes all filters
    var clearFilters = function () {
        filters.removeAll();
    }

    var outputArray = ko.computed(function () {
        return ko.utils.arrayFilter(inputArray(), function (item) {
            var result = true;
            for (var ii = 0; ii < filters().length; ii++) {
                var filter = filters()[ii];
                result = result && filterMatches(filter.filterExpression(),
                                                 item[filter.name]);
                }
            return result;
        });
    }, this);

    // Public interface
    var self = this;
    self.filterFor = filterFor;
    self.clearFilters = clearFilters;
    self.outputArray = outputArray;
};

