
var TableFilter = function (inputArray, columnsToSearch) {
    var filterExpression = ko.observable('');

    // Clear the current filterExpression
    var clearFilter = function () {
        filterExpression('');
    }

    // Utility function to see if a word is in any of the columnsToSearch of a row
    var wordMatchesRow = function (word, row) {
        if (word == '') {
            return true;
        }
        word = word.toLowerCase();
        for (var ii = 0; ii < columnsToSearch().length; ii++) {
            var column = columnsToSearch()[ii];
            if (String(row[column]).toLowerCase().indexOf(word) != -1) {
                // If the word is in any row, then keep the row
                return true;
            }
        }
        return false;
    }

    // Utility function to see if all words are in the columnsToSearch of a row
    var filterMatchesRow = function (words, row) {
        for (var ii = 0; ii < words.length; ii++) {
            var word = words[ii];
            if (!wordMatchesRow(word, row)) {
                // If any one word isn't in the row, then filter out the row
                return false;
            }
        }
        return true;
    }

    var outputArray = ko.computed(function () {
        // No need to bother if the filterExpression is empty
        if (filterExpression == '') {
            return inputArray();
        }
        var words = filterExpression().split(' ');
        return ko.utils.arrayFilter(inputArray(), function (row) {
            return filterMatchesRow(words, row);
        });
    }, this);

    // Public interface
    var self = this;
    self.outputArray = outputArray;
    self.filterExpression = filterExpression;
    self.clearFilter = clearFilter;
    self.columnsToSearch = columnsToSearch;
}
