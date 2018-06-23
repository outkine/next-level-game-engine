"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

eval('function a() { console.log("asdf") }');
console.log(typeof a === "undefined" ? "undefined" : _typeof(a));

var fs = require('fs');

var program = fs.readFileSync('./example.js', 'utf8');

function checkType(type) {
  if (!Object.key(INFO).includes(type)) throw new Error("Type ".concat(type, " is not defined."));
}

function filterProperties(array, properties) {
  return array.filter(function (item) {
    return Object.keys(properties).reduce(function (acc, val) {
      return acc && (typeof properties[val] === 'function' ? properties[val]() : properties[val]) === item[val];
    }, true);
  });
}

var Structure = function Structure(type) {
  _classCallCheck(this, Structure);

  this.type = type;
};

var Storage =
/*#__PURE__*/
function (_Structure) {
  _inherits(Storage, _Structure);

  function Storage(type) {
    var _this;

    _classCallCheck(this, Storage);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Storage).call(this, type));
    _this.amount = 0;
    return _this;
  }

  _createClass(Storage, [{
    key: "full",
    value: function full() {
      return this.amount >= INFO[this.type].capacity;
    }
  }, {
    key: "update",
    value: function update() {
      if (this.full()) this.amount = INFO[this.type].capacity;
    }
  }]);

  return Storage;
}(Structure);

var Mine =
/*#__PURE__*/
function (_Storage) {
  _inherits(Mine, _Storage);

  function Mine() {
    _classCallCheck(this, Mine);

    return _possibleConstructorReturn(this, _getPrototypeOf(Mine).apply(this, arguments));
  }

  _createClass(Mine, [{
    key: "update",
    value: function update() {
      this.amount += INFO[this.type].production;

      _get(_getPrototypeOf(Mine.prototype), "update", this).call(this);
    }
  }]);

  return Mine;
}(Storage);

var Projection =
/*#__PURE__*/
function (_Structure2) {
  _inherits(Projection, _Structure2);

  function Projection(type, fn) {
    var _this2;

    _classCallCheck(this, Projection);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(Projection).call(this, type));
    _this2.fn = fn;
    return _this2;
  }

  _createClass(Projection, [{
    key: "invoke",
    value: function invoke() {
      var cost;
      /* eslint no-unused-vars: 0 */

      function text(string) {
        cost = string.length * 50;
      }
      /* eslint-disable-next-line */


      eval(this.fn);

      if (cost === undefined) {
        throw new Error("Invocation ".concat(this.fn, " contains a function that does not exist."));
      }

      if (cost <= totalIron()) {
        this.willInvoke = true;
      }
    }
  }, {
    key: "invokeForReal",
    value: function invokeForReal() {
      /* eslint no-unused-vars: 0 */
      function text(string) {
        console.log('printing...');
      }
      /* eslint-disable-next-line */


      eval(this.fn);
      this.willInvoke = false;
    }
  }, {
    key: "update",
    value: function update() {
      if (this.willInvoke) this.invokeForReal();
    }
  }]);

  return Projection;
}(Structure);

var Villager =
/*#__PURE__*/
function () {
  function Villager() {
    _classCallCheck(this, Villager);
  }

  _createClass(Villager, [{
    key: "idle",
    value: function idle() {
      return this.building || this.delivering;
    }
  }, {
    key: "build",
    value: function build(type) {
      checkType(type);
      this.completeTurn = data.turn + INFO[type].buildDuration;
      this.building = true;
      this.buildingStructure = type;
    }
  }, {
    key: "actualBuild",
    value: function actualBuild() {
      var structure = new Structure(this.buildingStructure);
      data.structures.push(structure);
      this.building = false;
    }
  }, {
    key: "deliverFor",
    value: function deliverFor(type) {
      checkType(type);
      if (!INFO[type].deliverTo) throw new Error("Villager can't deliver for ".concat(type, "."));
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = filterProperties(data.structures, {
          type: INFO[type].deliverTo
        })[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var structure = _step.value;

          if (!structure.full()) {
            this.completeTurn = data.turn + DELIVERY_DURATION;
            this.delivering = true;
            this.deliveringTo = structure;
            this.inventory = structure.amount;
            structure.amount = 0;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: "actualDeliverFor",
    value: function actualDeliverFor() {
      this.deliveringTo.amount = this.inventory;
      this.inventory = 0;
      this.delivering = false;
    }
  }, {
    key: "invoke",
    value: function invoke(facility) {
      if (_typeof(facility) !== 'object' || facility.type !== 'astroprojectionFacility') {
        throw new Error("Can't invoke this facility.");
      }

      facility.invoke();
    }
  }, {
    key: "update",
    value: function update() {
      if (data.turn === this.completeTurn) {
        if (this.building) this.actualBuild();else if (this.delivering) this.actualDeliverTo();
      }
    }
  }]);

  return Villager;
}();

var INFO = {
  mine: {
    buildDuration: 5,
    deliverTo: 'ironPit',
    capacity: 50,
    production: 5,
    Class: Mine
  },
  ironPit: {
    cost: 50,
    buildDuration: 10,
    capacity: 300,
    Class: Storage
  },
  pixelExtractionFacility: {
    builtDuration: 6,
    deliverTo: 'rainbow',
    capacity: 100,
    Class: Mine,
    production: 50
  },
  rainbow: {
    buildDuration: 10,
    capacity: 1000,
    Class: Storage
  },
  astroprojectionFacility: {
    buildDuration: 10,
    Class: Projection
  }
};
var DELIVERY_DURATION = 2;
var data = {
  workers: _toConsumableArray(new Array(10)).map(function (_) {
    return new Villager();
  }),
  structures: [new INFO.ironPit.Class()],
  turn: 0
};

function totalIron() {}

function totalPixels() {}

console.log(program);
/* globals init, main */

/* eslint-disable-next-line */

eval(program);
if (typeof main !== 'function') throw new Error('"main" must be a function');
if (typeof init === 'function') init(data);

function mainLoop() {
  main(data);
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = data.workers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var worker = _step2.value;
      worker.update();
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = data.structures[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var structure = _step3.value;
      structure.update();
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  data.turn++;
  setTimeout(mainLoop, 1000);
}

mainLoop();