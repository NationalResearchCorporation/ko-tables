
// Paginates an array
// inputArray is the array to paginate
// pageSize is the number of items to display at a time
var Page = function (inputArray, defaultPageSize) {
    // currentPage is 1 indexed
    var currentPage = ko.observable(1);
    var currentPageSize = ko.observable(defaultPageSize);

    // List of the possible page sizes, given a large enough data set
    var possiblePageSizes = ko.observableArray([5, 10, 20, 50, 100]);

    // List of the possible page sizes filtered down to make sense for the current row count
    var availablePageSizes = ko.computed(function () {
        var dataLength = inputArray().length;
        // Always add at least the smallest option
        var actualPageSizes = [{ 'name': possiblePageSizes()[0], 'value': possiblePageSizes()[0] }];
        for (var ii = 1; ii < possiblePageSizes().length; ii++) {
            var current = possiblePageSizes()[ii];
            // Only add the next option if we have enough records for it to make sense
            if (current <= dataLength) {
                actualPageSizes.push({ 'name': current, 'value': current });
            }
        }

        // Enforce that the currentPageSize is less than or equal to the largest option
        var maxPageSize = actualPageSizes[actualPageSizes.length - 1];
        if (currentPageSize() > maxPageSize.value) {
            currentPageSize(maxPageSize.value);
        }

        // Add 'All' option if we have fewer rows than the biggest default page size
        var maxPossiblePageSize = possiblePageSizes()[possiblePageSizes().length - 1];
        if (maxPageSize.value < maxPossiblePageSize) {
            actualPageSizes.push({ 'name': 'All', 'value': inputArray().length });
        }
        return actualPageSizes;
    }, this);

    // maxPage is the 1 indexed maximum page number
    var maxPage = ko.computed(function () {
        var newMax = Math.max(1, Math.ceil(inputArray().length / currentPageSize()));
        // Force current page to be in the correct bounds
        if (isNaN(currentPage())) {
            currentPage(1);
        }
        currentPage(Math.max(1, Math.min(newMax, Math.floor(currentPage()))));
        return newMax;
    }, this);

    // Methods for changing the current page
    var prevPage = function() {
        self.currentPage(Math.max(1, self.currentPage() - 1));
    };

    var nextPage = function () {
        self.currentPage(Math.min(self.currentPage() + 1, self.maxPage()));
    };

    var outputArray = ko.computed(function () {
        var ret = inputArray().slice((currentPage() - 1) * currentPageSize(),
                                     currentPage() * currentPageSize());
        return ret;
    }, this);

    // Public interface
    var self = this;
    self.availablePageSizes = availablePageSizes;
    self.currentPageSize = currentPageSize;
    self.maxPage = maxPage;
    self.currentPage = currentPage;
    self.prevPage = prevPage;
    self.nextPage = nextPage;
    self.outputArray = outputArray;
    self.possiblePageSizes = possiblePageSizes;
};
