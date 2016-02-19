'use strict';

var expect = chai.expect;

describe('Student Unit Tests', function() {
	describe("ImageModel", function () {
		var modelModule = createModelModule();
		var imageCollectionModel = new modelModule.ImageCollectionModel()
		var imageModel;
		var date = new Date(2015, 5, 30, 7, 43, 0);

		beforeEach(function () {
			imageModel = new modelModule.ImageModel('images/testImage.png', date, "", 0, imageCollectionModel);
		});

		afterEach(function () {
			imageModel = undefined;
		});

		it('should add and then remove a listener correctly.', function() {
			var listener_fn = sinon.spy();
			var addListenerSpy = sinon.spy(imageModel, "addListener");
			var removeListenerSpy = sinon.spy(imageModel, "removeListener");

			imageModel.addListener(listener_fn);

			expect(addListenerSpy.calledWith(listener_fn), 'addListener should have been called with listener_fn.').to.be.true;
			expect(addListenerSpy.calledOnce, 'addListener should have been called once.').to.be.true;
			expect(imageModel.listeners.length, 'listeners.length should be one.').to.be.equal(1);

			imageModel.removeListener(listener_fn);

			expect(removeListenerSpy.calledWith(listener_fn), 'removeListener should have been called with listener_fn.').to.be.true;
			expect(removeListenerSpy.calledOnce, 'removeListener should have been called once.').to.be.true;
			expect(imageModel.listeners.length, 'listeners.length should be zero.').to.be.equal(0);

			imageModel.removeListener(listener_fn);
			expect(imageModel.listeners.length, 'listeners.length should still be zero.').to.be.equal(0);
		});

	it('should get and set a caption correctly.', function() {
		var listener_fn = sinon.spy();
		var getCaptionSpy = sinon.spy(imageModel, "getCaption");
		var setCaptionSpy = sinon.spy(imageModel, "setCaption");

		var caption = imageModel.getCaption();

		expect(getCaptionSpy.calledOnce, 'getCaption should have been called once').to.be.true;
		expect(caption, 'caption should have been empty').to.be.equal("");

		var newCaption = "i am a caption";
		imageModel.setCaption(newCaption);

		expect(setCaptionSpy.calledOnce, 'getCaption should have been called once').to.be.true;
		expect(imageModel.caption, 'caption should have been set to new caption').to.be.equal(newCaption);
	})

	it('should get and set a rating correctly.', function() {
		var listener_fn = sinon.spy();
		var getRatingSpy = sinon.spy(imageModel, "getRating");
		var setRatingSpy = sinon.spy(imageModel, "setRating");

		var rating = imageModel.getRating();

		expect(getRatingSpy.calledOnce, 'getRating should have been called once').to.be.true;
		expect(rating, 'rating should have been 0').to.be.equal(0);

		var newRating = 5;
		imageModel.setRating(newRating);

		expect(setRatingSpy.calledOnce, 'getRating should have been called once').to.be.true;
		expect(imageModel.rating, 'rating should have been new rating').to.be.equal(newRating);
	})

	it('should get a file path correctly.', function() {
		var listener_fn = sinon.spy();
		var getPathSpy = sinon.spy(imageModel, "getPath");

		var path = imageModel.getPath();

		expect(getPathSpy.calledOnce, 'getPath should have been called once').to.be.true;
		expect(path, 'path should have been images/testImage.png').to.be.equal('images/testImage.png');
	})

	it('should get a modification date correctly.', function() {
		var listener_fn = sinon.spy();
		var getDateSpy = sinon.spy(imageModel, "getModificationDate");

		var date = imageModel.getModificationDate().getTime();
		var setDate = new Date(2015, 5, 30, 7, 43, 0);

		expect(getDateSpy.calledOnce, 'getModificationDate should have been called once').to.be.true;
		expect(date, 'date should have been my birthday').to.be.equal(setDate.getTime());
	})

	})
});
