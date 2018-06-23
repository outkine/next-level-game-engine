"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function checkType(type) {
  if (!Object.keys(INFO).includes(type)) throw new Error("Type ".concat(type, " is not defined."));
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

      if (totalPixels() >= cost) {
        this.willInvoke = true;
        usePixels(cost);
      }
    }
  }, {
    key: "invokeForReal",
    value: function invokeForReal() {
      /* eslint no-unused-vars: 0 */
      function text(string) {
        display = string;
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

      if (totalIron() >= INFO[type].cost) {
        this.completeTurn = data.turn + INFO[type].buildDuration;
        this.building = true;
        this.buildingStructure = type;

        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        this.buildingArgs = args;
        useIron(INFO[type].cost);
      }
    }
  }, {
    key: "actualBuild",
    value: function actualBuild() {
      var structure = _construct(INFO[this.buildingStructure].Class, [this.buildingStructure].concat(_toConsumableArray(this.buildingArgs)));

      data.structures.push(structure);
      this.building = false;
    }
  }, {
    key: "deliverFor",
    value: function deliverFor(mine, storage) {
      if (!storage.full()) {
        this.completeTurn = data.turn + DELIVERY_DURATION;
        this.delivering = true;
        this.deliveringTo = storage;
        this.deliveringFrom = mine;
        this.inventory = mine.amount;
        mine.amount = 0;
      }
    }
  }, {
    key: "actualDeliverFor",
    value: function actualDeliverFor() {
      this.deliveringTo.amount += this.inventory;
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
        if (this.building) this.actualBuild();else if (this.delivering) this.actualDeliverFor();
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
    Class: Mine,
    cost: 50
  },
  ironPit: {
    cost: 50,
    buildDuration: 10,
    capacity: 300,
    Class: Storage
  },
  pixelExtractionFacility: {
    buildDuration: 6,
    deliverTo: 'rainbow',
    capacity: 100,
    Class: Mine,
    production: 50,
    cost: 50
  },
  rainbow: {
    buildDuration: 10,
    capacity: 1000,
    Class: Storage,
    cost: 50
  },
  astroprojectionFacility: {
    buildDuration: 10,
    Class: Projection,
    cost: 50
  }
};
var DELIVERY_DURATION = 2;
var data = {
  villagers: _toConsumableArray(new Array(10)).map(function (_) {
    return new Villager();
  }),
  structures: [new INFO.ironPit.Class('ironPit')],
  turn: 0
};
data.structures[0].amount = 100;

function total(type) {
  return filterProperties(data.structures, {
    type: type
  }).reduce(function (acc, val) {
    return acc += val.amount;
  }, 0);
}

function totalIron() {
  return total('ironPit');
}

function totalPixels() {
  return total('rainbow');
}

function use(type, amount) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = filterProperties(data.structures, {
      type: type
    })[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var structure = _step.value;

      if (amount > structure.amount) {
        structure.amount = 0;
        amount -= structure.amount;
      } else {
        structure.amount -= amount;
        break;
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

function useIron(amount) {
  use('ironPit', amount);
}

function usePixels(amount) {
  use('rainbow', amount);
}

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var debugCanvas = document.querySelector('#debug');
debugCanvas.height = 20000;
debugCanvas.width = 3000;
var debugCtx = debugCanvas.getContext('2d');
var program = "\nfunction filterProperties(array, properties) {\n  return array.filter((item) =>\n    Object.keys(properties).reduce(\n      (acc, val) =>\n        acc &&\n        (typeof properties[val] === 'function' ? properties[val]() : properties[val]) === item[val],\n      true,\n    ),\n  )\n}\n\nfunction init({ villagers }) {\n  for (let [i, villager] of villagers.entries()) {\n    if (i === 0) villager.assignment = 'build mine'\n    else if (i === 1 || (i === 8) | (i === 9)) villager.assignment = 'deliver iron'\n    else if (i === 2) villager.assignment = 'build pixel mine'\n    else if (i === 3) villager.assignment = 'deliver pixel'\n    else if (i === 4) villager.assignment = 'build astroprojection'\n    else if (i === 5) villager.assignment = 'invoke astroprojection'\n    else if (i === 6) villager.assignment = 'build iron storage'\n    else if (i === 7) villager.assignment = 'build pixel storage'\n  }\n}\n\nconst mineToStorageMapping = {\n  mine: 'ironPit',\n  pixelExtractionFacility: 'rainbow',\n}\n\nconst requirements = {\n  mine: 10,\n  ironPit: 5,\n  pixelExtractionFacility: 2,\n  rainbow: 1,\n  astroprojectionFacility: 1,\n}\n\nfunction build(type, villager, ...args) {\n  if (!villager.building) villager.build(type, ...args)\n}\n\nfunction deliver(mineType, villager, structures, villagers) {\n  if (!villager.delivering) {\n    const mines = filterProperties(structures, { type: mineType })\n    const storages = filterProperties(structures, { type: mineToStorageMapping[mineType] })\n    if (storages.length !== 0 && mines.length !== 0) {\n      let storageNumbers = storages.reduce((acc, val, i) => ({ ...acc, [i]: 0 }), {})\n      let mineNumbers = mines.reduce((acc, val, i) => ({ ...acc, [i]: 0 }), {})\n      for (let villager of villagers) {\n        if (villager.delivering) {\n          mineNumbers[mines.indexOf(villager.deliveringFrom)]++\n          storageNumbers[storages.indexOf(villager.deliveringTo)]++\n        }\n      }\n      storageNumbers = Object.keys(storageNumbers).sort(\n        (a, b) => storageNumbers[a] - storageNumbers[b],\n      )\n      mineNumbers = Object.keys(mineNumbers).sort((a, b) => mineNumbers[a] - mineNumbers[b])\n\n      villager.deliverFor(mines[mineNumbers[0]], storages[storageNumbers[0]])\n    }\n  }\n}\n\nfunction main({ villagers, structures, turn }) {\n  for (let villager of villagers) {\n    switch (villager.assignment) {\n      case 'build mine': {\n        if (filterProperties(structures, { type: 'mine' }).length <= 10) build('mine', villager)\n        break\n      }\n      case 'build iron storage': {\n        build('ironPit', villager)\n        break\n      }\n      case 'deliver iron': {\n        deliver('mine', villager, structures, villagers)\n        break\n      }\n      case 'build pixel mine': {\n        build('pixelExtractionFacility', villager)\n        break\n      }\n      case 'build pixel storage': {\n        build('rainbow', villager)\n        break\n      }\n      case 'deliver pixel': {\n        deliver('pixelExtractionFacility', villager, structures, villagers)\n        break\n      }\n      case 'build astroprojection': {\n        build('astroprojectionFacility', villager, 'text(\"Hello, world!\")')\n        break\n      }\n      case 'invoke astroprojection': {\n        const astroprojectionFacilities = filterProperties(structures, {\n          type: 'astroprojectionFacility',\n        })\n        if (astroprojectionFacilities[0]) {\n          villager.invoke(astroprojectionFacilities[0])\n        }\n      }\n    }\n  }\n}\n";
/* eslint-disable-next-line */

eval(program + ';init(data)');
var DEBUG = true;
var display = false;
var images = {};
var _arr = ['villager', 'mine', 'ironPit', 'pixelExtractionFacility', 'rainbow', 'astroprojectionFacility', 'iron', 'pixel'];

for (var _i = 0; _i < _arr.length; _i++) {
  var kind = _arr[_i];
  var image = new Image();
  images[kind] = image;
  image.src = "assets/".concat(kind, ".png");
}

function mainLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  /* eslint-disable-next-line */

  eval(program + ';main(data)');
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = data.villagers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var villager = _step2.value;
      villager.update();
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

  if (DEBUG) {
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
      for (var _iterator4 = ['villager', 'mine', 'ironPit', 'pixelExtractionFacility', 'rainbow', 'astroprojectionFacility', 'iron', 'pixel'].entries()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
        var _step4$value = _slicedToArray(_step4.value, 2),
            i = _step4$value[0],
            image = _step4$value[1];

        var count = 0;

        switch (image) {
          case 'villager':
            {
              count = data.villagers.length;
              break;
            }

          case 'mine':
            {
              count = filterProperties(data.structures, {
                type: 'mine'
              }).length;
              break;
            }

          case 'ironPit':
            {
              count = filterProperties(data.structures, {
                type: 'ironPit'
              }).length;
              break;
            }

          case 'pixelExtractionFacility':
            {
              count = filterProperties(data.structures, {
                type: 'pixelExtractionFacility'
              }).length;
              break;
            }

          case 'rainbow':
            {
              count = filterProperties(data.structures, {
                type: 'rainbow'
              }).length;
              break;
            }

          case 'astroprojectionFacility':
            {
              count = filterProperties(data.structures, {
                type: 'astroprojectionFacility'
              }).length;
              break;
            }

          case 'iron':
            {
              count = totalIron();
              break;
            }

          case 'pixel':
            {
              count = totalPixels();
              break;
            }
        }

        for (var x = 0; x < count; x++) {
          debugCtx.drawImage(images[image], x * 40, i * 100, 100, 100); // console.log(imageges[image])
        }
      }
    } catch (err) {
      _didIteratorError4 = true;
      _iteratorError4 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
          _iterator4.return();
        }
      } finally {
        if (_didIteratorError4) {
          throw _iteratorError4;
        }
      }
    }
  }

  if (display) {
    canvas.style.background = 'red';
  } // console.log(images)


  setTimeout(mainLoop, 0);
}

mainLoop();