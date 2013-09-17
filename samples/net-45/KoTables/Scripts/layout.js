
var model = null;

// Provide the _DataSourceLayout a reference to the grid model
var registerModel = function (newModel) {
    model = newModel;
}

// Change the data source, notifying the model of the event
var changeDataSource = function (dataSource) {
    if (model != null) {
        jQuery.getJSON("/api/Data/GetData/" + dataSource, function (data) {
            model.onDataSourceChanging();
            model.data(data.data);
            model.columns(data.columns);
            model.onDataSourceChanged();
        });
    }
}
