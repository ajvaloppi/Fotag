'use strict';

/**
 * A function that creates and returns all of the model classes and constants.
  */
function createViewModule() {

    var LIST_VIEW = 'LIST_VIEW';
    var GRID_VIEW = 'GRID_VIEW';
    var RATING_CHANGE = 'RATING_CHANGE';
    var VIEW_CHANGE = 'VIEW_CHANGE';

    /**
     * An object representing a DOM element that will render the given ImageModel object.
     */
    var ImageRenderer = function(imageModel) {
        this.imageModel = imageModel;
        this.currentView = GRID_VIEW;
        this.minRating = 0;
        this._init();
    };

    _.extend(ImageRenderer.prototype, {

        /**
         * Returns an element representing the ImageModel, which can be attached to the DOM
         * to display the ImageModel.
         */

         _init: function() {
            var self = this;
            this.newImg = document.createElement('div');
            this.newImg.src = this.imageModel.path;
            this.newImg.width = 300;
            var imageTemplate = document.getElementById('imageDisplay');
            this.newImg.appendChild(document.importNode(imageTemplate.content, true));
            
            var image = this.newImg.querySelector('.image');
            image.src = this.imageModel.path;
            image.width = 300;
            image.addEventListener('click', function () {
                var modal = document.getElementById("modal");
                var image = modal.querySelector(".imageModal");
                image.src = self.imageModel.path;
                
                var imageName = modal.querySelector('.imageInfoModalName');
                var imgName = self.imageModel.path.slice(7);
                imageName.innerHTML = imgName;

                var imageCaption = modal.querySelector('.imageInfoModalCaption');
                var imgCaption = self.imageModel.caption ? self.imageModel.caption : "";
                imageCaption.innerHTML = imgCaption;

                var imageDate = modal.querySelector('.imageInfoModalDate');
                var imgDate = self.imageModel.modificationDate.toDateString() + " at " + self.imageModel.modificationDate.toLocaleTimeString();
                imageDate.innerHTML = imgDate;

                var imageRating = modal.querySelector('.imageInfoModalRating');
                var imgRating = self.imageModel.rating;

                var i;
                for (i = 1; i <= imgRating; i++){
                    var fullStar = imageRating.querySelector(".rating"+i+"Modal");
                    fullStar.src = "glyphs/glyphicons-50-star-black.png";
                }

                var j;
                for (j = imgRating + 1; j <= 5; j++){
                    var emptyStar = imageRating.querySelector(".rating"+j+"Modal");
                    emptyStar.src = "glyphs/glyphicons-49-star-empty-black.png";
                }

                modal.showModal();
            });

            var imageInfo = this.newImg.querySelector('.imageInfo');
            var details = imageInfo.querySelector('.imageMeta');
            
            this.imageName = document.createElement('div');
            var imgName = this.imageModel.path.slice(7);
            this.imageName.innerHTML = imgName;
            details.appendChild(this.imageName);

            var imageRating = imageInfo.querySelector('.rating');
            var imgRating = this.imageModel.rating;

            var i;
            for (i = 1; i <= imgRating; i++){
                (function (i) {
                    var fullStar = imageRating.querySelector(".rating"+i);
                    fullStar.src = "glyphs/glyphicons-50-star.png";
                    imageRating.appendChild(fullStar);
                    fullStar.addEventListener('click', function() {
                        var rating = Number(fullStar.classList[0].slice(6));
                        self.setRating(self, rating);
                    });
                })(i)
                
            }

            var j;
            for (j = imgRating + 1; j <= 5; j++){
                (function (j){
                    var emptyStar = imageRating.querySelector(".rating"+j);
                    emptyStar.src = "glyphs/glyphicons-49-star-empty.png";
                    imageRating.appendChild(emptyStar);
                    emptyStar.addEventListener('click', function() {
                        var rating = Number(emptyStar.classList[0].slice(6));
                        self.setRating(self, rating);
                    });
                })(j)
            }

            var removeFilter = imageRating.querySelector(".removeRating");
            removeFilter.src = "glyphs/glyphicons-193-circle-remove.png";
            imageRating.appendChild(removeFilter);
            removeFilter.addEventListener('click', function() {
                self.setRating(self, 0);
            });

            this.imageCaption = document.createElement('em');
            var imgCaption = this.imageModel.caption ? this.imageModel.caption : "Click to add a caption!";
            this.imageCaption.innerHTML = imgCaption;
            details.appendChild(this.imageCaption);
        
            this.modal = document.createElement('dialog');
            this.modal.classList.add('modal');
            var dialog = '<img class="removeCaptionModal modalClose" src="glyphs/glyphicons-208-remove-2.png"><input type="text" class="newCaption"> </br> <button class="saveCaption">Save Caption</button>';
            this.modal.innerHTML = dialog;
            details.appendChild(this.modal);            


            this.imageCaption.addEventListener('click', function() {
                self.modal.showModal();
            });

            var closeCaption = this.modal.querySelector('.removeCaptionModal');
            closeCaption.addEventListener('click', function () {
                self.modal.querySelector('.newCaption').value = "";
                self.modal.close();
            });

            var submitBtn = this.modal.querySelector('.saveCaption');
            submitBtn.addEventListener('click', function() {
                var newCaption = self.modal.querySelector('.newCaption').value;
                self.imageModel.setCaption(newCaption);
                var imgCaption = self.imageModel.caption ? self.imageModel.caption : "Click to add a caption!";
                self.imageCaption.innerHTML = imgCaption;
                self.modal.close();
            });


            this.imageDate = document.createElement('div');
            var imgDate = this.imageModel.modificationDate.toDateString() + " at " + this.imageModel.modificationDate.toLocaleTimeString();
            this.imageDate.innerHTML = imgDate;
            details.appendChild(this.imageDate);
        },
         
        getElement: function() {
            if (this.currentView == GRID_VIEW){
                this.newImg.className = "imageGridView";
                var details = this.newImg.querySelector('.imageInfo');
                details.classList.add("infoGridView");
                details.classList.remove("infoListView");
            }
            else if (this.currentView == LIST_VIEW) {
                this.newImg.className = "imageListView";
                var details = this.newImg.querySelector('.imageInfo');
                details.classList.add("infoListView");
                details.classList.remove("infoGridView");
            }
            else {
                //here be dragons
                throw new Error("NOT A GOOD VIEW" + JSON.stringify(arguments));
            }
            if (this.minRating <= this.imageModel.rating){
                return this.newImg;
            }
            else {
                return;
            }
        },

        /**
         * Returns the ImageModel represented by this ImageRenderer.
         */
        getImageModel: function() {
            return this.imageModel;
        },

        /**
         * Sets the ImageModel represented by this ImageRenderer, changing the element and its
         * contents as necessary.
         */
        setImageModel: function(imageModel) {
            this.imageModel = imageModel;
        },

        /**
         * Changes the rendering of the ImageModel to either list or grid view.
         * @param viewType A string, either LIST_VIEW or GRID_VIEW
         */
        setToView: function(viewType) {
            this.currentView = viewType;
        },

        /**
         * Returns a string of either LIST_VIEW or GRID_VIEW indicating which view type it is
         * currently rendering.
         */
        getCurrentView: function() {
            return this.currentView;
        },

        setRating: function (self, rating) {
            var imageInfo = this.newImg.querySelector('.imageInfo');
            var imageRating = imageInfo.querySelector('.rating');

            var i;
            for (i = 1; i <= rating; i++){
                (function (i) {
                    var fullStar = imageRating.querySelector(".rating"+i);
                    fullStar.src = "glyphs/glyphicons-50-star.png";
                })(i)
                
            }

            var j;
            for (j = rating + 1; j <= 5; j++){
                (function (j){
                    var emptyStar = imageRating.querySelector(".rating"+j);
                    emptyStar.src = "glyphs/glyphicons-49-star-empty.png";
                })(j)
            }

            self.imageModel.setRating(rating);
        },

        setMinRating: function(minRating) {
            this.minRating = minRating;
        }

    });

    /**
     * A factory is an object that creates other objects. In this case, this object will create
     * objects that fulfill the ImageRenderer class's contract defined above.
     */
    var ImageRendererFactory = function() {
    };

    _.extend(ImageRendererFactory.prototype, {
        /**
         * Creates a new ImageRenderer object for the given ImageModel
         */
         createImageRenderer: function(imageModel, view, rating) {
            var appContainer = document.getElementById('app-container');
            var renderer = new ImageRenderer(imageModel); 
            renderer.setToView(view);
            renderer.setMinRating(rating);
            var element = renderer.getElement();
            if (element) {
                appContainer.appendChild(renderer.getElement());
            }    
        }
    });

    /**
     * An object representing a DOM element that will render an ImageCollectionModel.
     * Multiple such objects can be created and added to the DOM (i.e., you shouldn't
     * assume there is only one ImageCollectionView that will ever be created).
     */
    var ImageCollectionView = function(imageRendererFactory, imageCollectionModel) {
        // TODO
        this.factory = imageRendererFactory;
        this.collectionModel = imageCollectionModel;
        this.view = GRID_VIEW;
        this.minRating = 0;
    };

    _.extend(ImageCollectionView.prototype, {
        /**
         * Returns an element that can be attached to the DOM to display the ImageCollectionModel
         * this object represents.
         */
        getElement: function(fromLoad) {
            var collectionModel = this.getImageCollectionModel();
            var currentView = this.getCurrentView();
            var minRating = this.minRating;

            if (!fromLoad){
                var appContainer = document.getElementById('app-container');
                while(appContainer.firstChild){
                     appContainer.removeChild(appContainer.firstChild);
                } 
            }

            for (var i = 0; i < collectionModel.imageModels.length; i++) {
                this.factory.createImageRenderer(collectionModel.imageModels[i], currentView, minRating);
            }
        },

        /**
         * Gets the current ImageRendererFactory being used to create new ImageRenderer objects.
         */
        getImageRendererFactory: function() {
            // TODO
            return this.factory;
        },

        /**
         * Sets the ImageRendererFactory to use to render ImageModels. When a *new* factory is provided,
         * the ImageCollectionView should redo its entire presentation, replacing all of the old
         * ImageRenderer objects with new ImageRenderer objects produced by the factory.
         */
        setImageRendererFactory: function(imageRendererFactory) {
            this.factory = imageRendererFactory;
        },

        /**
         * Returns the ImageCollectionModel represented by this view.
         */
        getImageCollectionModel: function() {
            return this.collectionModel;
        },

        /**
         * Sets the ImageCollectionModel to be represented by this view. When setting the ImageCollectionModel,
         * you should properly register/unregister listeners with the model, so you will be notified of
         * any changes to the given model.
         */
        setImageCollectionModel: function(imageCollectionModel) {
            this.collectionModel = imageCollectionModel;
        },

        /**
         * Changes the presentation of the images to either grid view or list view.
         * @param viewType A string of either LIST_VIEW or GRID_VIEW.
         */
        setToView: function(viewType) {
            this.view = viewType;
        },

        /**
         * Returns a string of either LIST_VIEW or GRID_VIEW indicating which view type is currently
         * being rendered.
         */
        getCurrentView: function() {
            return this.view;
        },

        setMinRating: function(rating) {
            this.minRating = rating;
        }
    });

    /**
     * An object representing a DOM element that will render the toolbar to the screen.
     */
     var Toolbar = function() {
        this.currentView = GRID_VIEW; //initialization
        this.ratingFilter = 0;
        this.listeners = [];
        this._init();

        this.notify = function(eventType, eventData) {
            _.each(this.listeners, function(listener) {
               listener(eventType, Date.now(), eventData); 
           });
        }
    };

    _.extend(Toolbar.prototype, {
        /**
         * Returns an element representing the toolbar, which can be attached to the DOM.
         */
         _init: function() {
            var self = this;
            this.toolbarDiv = document.createElement('div');
            this.toolbarDiv.id = 'toolbarDiv';
            var toolbarTemplate = document.getElementById('toolbar');
            this.toolbarDiv.appendChild(document.importNode(toolbarTemplate.content, true));

            var gridBtn = this.toolbarDiv.querySelector('.gridBtn');
            var gridBtnImg = gridBtn.querySelector('.gridBtnImg');
            gridBtnImg.src = "glyphs/glyphicons-157-show-thumbnails.png"
            gridBtn.addEventListener('click', function (){
                self.setToView(self, GRID_VIEW);
            });

            var listBtn = this.toolbarDiv.querySelector('.listBtn');
            var listBtnImg = listBtn.querySelector('.listBtnImg');
            listBtnImg.src = "glyphs/glyphicons-115-list.png";
            listBtn.addEventListener('click', function (){
                self.setToView(self, LIST_VIEW);
            });

            var ratingBtns = this.toolbarDiv.querySelector('.ratingBtns');
            var i;
            for (i = 1; i <= 5; i++){
                (function (i) {
                    var ratingStar = ratingBtns.querySelector(".ratingBtn"+i);
                    ratingStar.src = "glyphs/glyphicons-49-star-empty.png";
                    ratingBtns.appendChild(ratingStar);
                    ratingStar.addEventListener('click', function() {
                        var rating = Number(ratingStar.classList[0].slice(9));
                        self.setRating(self, rating);
                    });
                })(i)  
            }

            var removeFilter = ratingBtns.querySelector(".removeBtn");
            removeFilter.src = "glyphs/glyphicons-193-circle-remove.png";
            ratingBtns.appendChild(removeFilter);
            removeFilter.addEventListener('click', function() {
                self.setRating(self, 0);
            });
        },

        getElement: function() {
            return this.toolbarDiv
        },

        /**
         * Registers the given listener to be notified when the toolbar changes from one
         * view type to another.
         * @param listener_fn A function with signature (toolbar, eventType, eventDate), where
         *                    toolbar is a reference to this object, eventType is a string of
         *                    either, LIST_VIEW, GRID_VIEW, or RATING_CHANGE representing how
         *                    the toolbar has changed (specifically, the user has switched to
         *                    a list view, grid view, or changed the star rating filter).
         *                    eventDate is a Date object representing when the event occurred.
         */
        addListener: function(listener_fn) {
            this.listeners.push(listener_fn);
        },

        /**
         * Removes the given listener from the toolbar.
         */
        removeListener: function(listener_fn) {
            var index = this.imageModels.indexOf(imageModel);
            if (index !== -1) {
                this.imageModels.splice(index, 1);
            }
        },

        /**
         * Sets the toolbar to either grid view or list view.
         * @param viewType A string of either LIST_VIEW or GRID_VIEW representing the desired view.
         */
        setToView: function(self, viewType) {
            if (this.currentView !== viewType) {
                this.currentView = viewType;
                this.notify(self, VIEW_CHANGE);
            }  
        },

        /**
         * Returns the current view selected in the toolbar, a string that is
         * either LIST_VIEW or GRID_VIEW.
         */
        getCurrentView: function() {
            return this.currentView;

        },

        /**
         * Returns the current rating filter. A number in the range [0,5], where 0 indicates no
         * filtering should take place.
         */
        getCurrentRatingFilter: function() {
            return this.ratingFilter;
        },

        /**
         * Sets the rating filter.
         * @param rating An integer in the range [0,5], where 0 indicates no filtering should take place.
         */
        setRatingFilter: function(rating) {
            this.ratingFilter = rating;

        },

        setRating: function (self, rating) {
            var ratingBtns = self.toolbarDiv.querySelector('.ratingBtns');
            var i;
            for (i = 1; i <= rating; i++){
                (function (i) {
                    var fullStar = ratingBtns.querySelector(".ratingBtn"+i);
                    fullStar.src = "glyphs/glyphicons-50-star.png";
                })(i)
                
            }

            var j;
            for (j = rating + 1; j <= 5; j++){
                (function (j){
                    var emptyStar = ratingBtns.querySelector(".ratingBtn"+j);
                    emptyStar.src = "glyphs/glyphicons-49-star-empty.png";
                })(j)
            }

            this.setRatingFilter(rating);
            this.notify(self, RATING_CHANGE);
        }
    });

    /**
     * An object that will allow the user to choose images to display.
     * @constructor
     */
    var FileChooser = function() {
        this.listeners = [];
        this._init();
    };

    _.extend(FileChooser.prototype, {
        // This code partially derived from: http://www.html5rocks.com/en/tutorials/file/dndfiles/
        _init: function() {
            var self = this;
            this.fileChooserDiv = document.createElement('div');
            var fileChooserTemplate = document.getElementById('file-chooser');
            this.fileChooserDiv.appendChild(document.importNode(fileChooserTemplate.content, true));
            var fileChooserInput = this.fileChooserDiv.querySelector('.files-input');
            fileChooserInput.addEventListener('change', function(evt) {
                var files = evt.target.files;
                var eventDate = new Date();
                _.each(
                    self.listeners,
                    function(listener_fn) {
                        listener_fn(self, files, eventDate);
                    }
                );
            });
        },

        /**
         * Returns an element that can be added to the DOM to display the file chooser.
         */
        getElement: function() {
            return this.fileChooserDiv;
        },

        /**
         * Adds a listener to be notified when a new set of files have been chosen.
         * @param listener_fn A function with signature (fileChooser, fileList, eventDate), where
         *                    fileChooser is a reference to this object, fileList is a list of files
         *                    as returned by the File API, and eventDate is when the files were chosen.
         */
        addListener: function(listener_fn) {
            if (!_.isFunction(listener_fn)) {
                throw new Error("Invalid arguments to FileChooser.addListener: " + JSON.stringify(arguments));
            }

            this.listeners.push(listener_fn);
        },

        /**
         * Removes the given listener from this object.
         * @param listener_fn
         */
        removeListener: function(listener_fn) {
            if (!_.isFunction(listener_fn)) {
                throw new Error("Invalid arguments to FileChooser.removeListener: " + JSON.stringify(arguments));
            }
            this.listeners = _.without(this.listeners, listener_fn);
        }
    });

    // Return an object containing all of our classes and constants
    return {
        ImageRenderer: ImageRenderer,
        ImageRendererFactory: ImageRendererFactory,
        ImageCollectionView: ImageCollectionView,
        Toolbar: Toolbar,
        FileChooser: FileChooser,

        LIST_VIEW: LIST_VIEW,
        GRID_VIEW: GRID_VIEW,
        RATING_CHANGE: RATING_CHANGE,
        VIEW_CHANGE: VIEW_CHANGE
    };
}