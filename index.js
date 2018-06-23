const fs = require('fs')

const program = fs.readFileSync('./example.js', 'utf8')

const c = console.log

function checkType(type) {
  if (!Object.keys(INFO).includes(type)) throw new Error(`Type ${type} is not defined.`)
}

function filterProperties(array, properties) {
  return array.filter((item) =>
    Object.keys(properties).reduce(
      (acc, val) =>
        acc &&
        (typeof properties[val] === 'function' ? properties[val]() : properties[val]) === item[val],
      true,
    ),
  )
}

class Structure {
  constructor(type) {
    this.type = type
  }
}

class Storage extends Structure {
  constructor(type) {
    super(type)
    this.amount = 0
  }
  full() {
    return this.amount >= INFO[this.type].capacity
  }
  update() {
    if (this.full()) this.amount = INFO[this.type].capacity
  }
}

class Mine extends Storage {
  update() {
    this.amount += INFO[this.type].production
    super.update()
  }
}

class Projection extends Structure {
  constructor(type, fn) {
    super(type)
    this.fn = fn
  }

  invoke() {
    let cost
    /* eslint no-unused-vars: 0 */
    function text(string) {
      cost = string.length * 50
    }

    /* eslint-disable-next-line */
    eval(this.fn)
    if (cost === undefined) {
      throw new Error(`Invocation ${this.fn} contains a function that does not exist.`)
    }
    if (totalPixels() >= cost) {
      this.willInvoke = true
      usePixels(cost)
    }
  }

  invokeForReal() {
    /* eslint no-unused-vars: 0 */
    function text(string) {
      process.exit()
    }

    /* eslint-disable-next-line */
    eval(this.fn)

    this.willInvoke = false
  }

  update() {
    if (this.willInvoke) this.invokeForReal()
  }
}

class Villager {
  idle() {
    return this.building || this.delivering
  }

  build(type, ...args) {
    checkType(type)

    if (totalIron() >= INFO[type].cost) {
      this.completeTurn = data.turn + INFO[type].buildDuration
      this.building = true
      this.buildingStructure = type
      this.buildingArgs = args
      useIron(INFO[type].cost)
    }
  }

  actualBuild() {
    const structure = new INFO[this.buildingStructure].Class(
      this.buildingStructure,
      ...this.buildingArgs,
    )
    data.structures.push(structure)
    this.building = false
  }

  deliverFor(mine, storage) {
    if (!storage.full()) {
      this.completeTurn = data.turn + DELIVERY_DURATION
      this.delivering = true
      this.deliveringTo = storage
      this.deliveringFrom = mine
      this.inventory = mine.amount
      mine.amount = 0
    }
  }

  actualDeliverFor() {
    this.deliveringTo.amount += this.inventory
    this.inventory = 0
    this.delivering = false
  }

  invoke(facility) {
    if (typeof facility !== 'object' || facility.type !== 'astroprojectionFacility') {
      throw new Error(`Can't invoke this facility.`)
    }

    facility.invoke()
  }

  update() {
    if (data.turn === this.completeTurn) {
      if (this.building) this.actualBuild()
      else if (this.delivering) this.actualDeliverFor()
    }
  }
}

const INFO = {
  mine: {
    buildDuration: 5,
    deliverTo: 'ironPit',
    capacity: 50,
    production: 5,
    Class: Mine,
    cost: 50,
  },
  ironPit: {
    cost: 50,
    buildDuration: 10,
    capacity: 300,
    Class: Storage,
  },
  pixelExtractionFacility: {
    buildDuration: 6,
    deliverTo: 'rainbow',
    capacity: 100,
    Class: Mine,
    production: 50,
    cost: 50,
  },
  rainbow: {
    buildDuration: 10,
    capacity: 1000,
    Class: Storage,
    cost: 50,
  },
  astroprojectionFacility: {
    buildDuration: 10,
    Class: Projection,
    cost: 50,
  },
}

const DELIVERY_DURATION = 2

let data = {
  villagers: [...new Array(10)].map((_) => new Villager()),
  structures: [new INFO.ironPit.Class('ironPit')],
  turn: 0,
}
data.structures[0].amount = 100

function total(type) {
  return filterProperties(data.structures, { type }).reduce((acc, val) => (acc += val.amount), 0)
}
function totalIron() {
  return total('ironPit')
}

function totalPixels() {
  return total('rainbow')
}

function use(type, amount) {
  for (let structure of filterProperties(data.structures, { type })) {
    if (amount > structure.amount) {
      structure.amount = 0
      amount -= structure.amount
    } else {
      structure.amount -= amount
      break
    }
  }
}

function useIron(amount) {
  use('ironPit', amount)
}

function usePixels(amount) {
  use('rainbow', amount)
}

/* eslint-disable-next-line */
eval(program + ';init(data)')

function mainLoop() {
  /* eslint-disable-next-line */
  eval(program + ';main(data)')
  for (let villager of data.villagers) {
    villager.update()
  }
  for (let structure of data.structures) {
    structure.update()
  }
  data.turn++
  console.log(data.structures.map((structure) => structure.type).join(' '))
  setTimeout(mainLoop, 100)
}

mainLoop()
