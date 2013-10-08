
var model = null;

// Provide the _DataSourceLayout a reference to the grid model
var registerModel = function (newModel) {
    model = newModel;
}

// Change the data source, notifying the model of the event
var changeDataSource = function (dataSource) {
    if (model != null) {
        jQuery.getJSON("/api/Data/GetData/" + dataSource, function (data) {
            // Some custom formatting proof of concept.
            // Can't set the cellRender function in JSON, have to attach it after it comes across the network.
            for (var ii in data.columns) {
                if (data.columns[ii].format == 'price') {
                    data.columns[ii].cellRender = function (row, column, data) {
                        return '$' + data;
                    }
                }
            }

            model.onDataSourceChanging();
            model.data(data.data);
            model.columns(data.columns);
            model.onDataSourceChanged();
        });
    }
}
