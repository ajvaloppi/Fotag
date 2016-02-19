'use strict';

// This should be your main point of entry for your app

window.addEventListener('load', function() {
    var modelModule = createModelModule();
    var viewModule = createViewModule();
    var appContainer = document.getElementById('app-container');
    var factory = new viewModule.ImageRendererFactory();
    var toolbar = new viewModule.Toolbar();
    var header = document.getElementById('header');
    header.appendChild(toolbar.getElement()); 

    //localStorage.clear(); 

    // Attach the file chooser to the page. You can choose to put this elsewhere, and style as desired

    var imageCollectionModel = modelModule.loadImageCollectionModel();

    var imageCollectionView = new viewModule.ImageCollectionView(factory, imageCollectionModel);

    var fileChooser = new viewModule.FileChooser();
    var toolbarDiv = document.getElementById('toolbarDiv')
    toolbarDiv.appendChild(fileChooser.getElement());

    // Demo that we can choose files and save to local storage. This can be replaced, later
    fileChooser.addListener(function(fileChooser, files, eventDate) {
        _.each(
            files,
            function(file) {
                var model =
                    new modelModule.ImageModel(
                        'images/' + file.name,
                        file.lastModifiedDate,
                        '',
                        0, imageCollectionModel
                        );
                imageCollectionModel.addImageModel(model);
            }
        );
        imageCollectionView.getElement(false);
        modelModule.storeImageCollectionModel(imageCollectionModel);
    });

    var storedImageDiv = document.createElement('div');
    imageCollectionView.getElement(true);

    var close = document.getElementById("removeModal");
    close.addEventListener('click', function () {
        var modal = document.getElementById("modal");
        modal.close();
    });

    toolbar.addListener(function(toolbar, eventDate, eventType) {
        if (eventType === viewModule.RATING_CHANGE){
            imageCollectionView.setMinRating(toolbar.ratingFilter);
            imageCollectionView.getElement(false); 
        }
        else if (eventType === viewModule.VIEW_CHANGE){
            imageCollectionView.setToView(toolbar.currentView);
            imageCollectionView.getElement(false); 
        }
    })
});

















