// Async foreach test
(function() {

	var each = asyncForeach;

	// Usage example
	each([1, 2, 3], function(item, index, done) {
		setTimeout(function() {
			console.log(item);
			done();
		}, 2000);
	}, function() {
		console.log("end");
	});

	asyncTest("Тестируем на массиве", function() {
		expect(2);

		var arrayCopy = [],
			indexList = [],
			iterator,
			done,
			array;

		iterator = function(item, index, done) {
			setTimeout(function() {
				arrayCopy.push(item);
				indexList.push(index);
				done();
			}, 100)
		};

		done = function() {
			deepEqual(array, arrayCopy, "копирование массива прошло");
			deepEqual(indexList, [0, 1, 2, 3], "копирование индексов массива прошло");
			start();
		};

		array = [11, 22, 33, 44];
		each(array, iterator, done);
		this.clock.tick(1000);
	});

	asyncTest("Тестируем на объекте", function() {
		expect(2);

		var objCopy = {},
			indexList = [],
			iterator,
			done,
			obj;

		iterator = function(item, index, done) {
			setTimeout(function() {
				objCopy[index] = item;
				indexList.push(index);
				done();
			}, 100)
		};

		done = function() {
			deepEqual(obj, objCopy, "копирование объекта прошло");
			deepEqual(indexList, ['key1', 'key2', 'key3', 'key4'], "копирование ключей объекта прошло");
			start();
		};

		obj = {
			key1: 11,
			key2: 22,
			key3: 33,
			key4: 44
		};

		each(obj, iterator, done);
		this.clock.tick(1000);
	});

	asyncTest("Тестируем на асинхронность", function() {
		expect(6);

		//var array = {11,22,33,44];
		var obj = {
			key1: 11,
			key2: 22,
			key3: 33,
			key4: 44
		},
			iterator,
			doneSpy,
			iteratorSpy,
			asyncIterator;

		iterator = function(item, intex, done) {
			setTimeout(function() {
				asyncIterator();
				done();
			}, 100);
		};
	
		doneSpy = this.spy();
		iteratorSpy = this.spy(iterator);
		asyncIterator = this.spy();

		each(obj, iteratorSpy, doneSpy);

		ok(!doneSpy.called, "цикл не завершен")
		ok(iteratorSpy.calledOnce, "цикл инициализировался");
		ok(!asyncIterator.called, "цикл не начался");

		this.clock.tick(1000);

		ok(doneSpy.calledOnce, "цикл завершен");
		equal(iteratorSpy.callCount, 4, "цикл завершился");
		equal(asyncIterator.callCount, 4, "цикл завершился");

		start();
	});

	asyncTest("Тестируем на пустом массиве, пустом объекте и на некорректном объекте и ф-ии итератора", function() {
		expect(35);

		var self = this,
			testForEmpty = function(obj) {
				var doneSpy = self.spy(),
					iteratorSpy = self.spy(iterator),
					asyncIterator = self.spy(),
					iterator;

				iterator = function(item, intex, done) {
					setTimeout(function() {
						asyncIterator();
						done();
					}, 100);
				};

				each(obj, iteratorSpy, doneSpy);

				ok(!doneSpy.called, "цикл и не начался");
				ok(!iteratorSpy.called, "цикл и не начался");
				ok(!asyncIterator.called, "цикл и не начался");

				self.clock.tick(1000);

				ok(!doneSpy.called, "цикл и не начинался");
				ok(!iteratorSpy.called, "цикл и не начинался");
				ok(!asyncIterator.called, "цикл и не начинался");
			},

			testWithoutDone = function() {
				var doneSpy = self.spy(),
					asyncIterator = self.spy(),
					iteratorSpy,
					iterator;

				iterator = function(item, intex, done) {
					setTimeout(function() {
						asyncIterator();
						done();
					}, 100);
				};

				iteratorSpy = self.spy(iterator);

				each([1], iteratorSpy);

				ok(iteratorSpy.called, "цикл инициализировался");

				self.clock.tick(1000);

				ok(!doneSpy.called, "цикл и не вызывался");
				ok(iteratorSpy.calledOnce, "цикл и не начинался");
				ok(asyncIterator.calledOnce, "цикл и не начинался");
			};

		testForEmpty([]);
		testForEmpty({})
		testForEmpty(null)
		testForEmpty()
		testForEmpty("")

		testWithoutDone();

		throws(function() {
			each([1]);
		}, "exception for not function occurred");
		start();

	});
})()