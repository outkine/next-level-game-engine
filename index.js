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
      ctx.fillText(string, 0, 0)
      console.log('DONE')
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

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const debugCanvas = document.querySelector('#debug')
debugCanvas.height = 20000
debugCanvas.width = 3000
const debugCtx = debugCanvas.getContext('2d')

const program = `
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

function init({ villagers }) {
  for (let [i, villager] of villagers.entries()) {
    if (i === 0) villager.assignment = 'build mine'
    else if (i === 1 || (i === 8) | (i === 9)) villager.assignment = 'deliver iron'
    else if (i === 2) villager.assignment = 'build pixel mine'
    else if (i === 3) villager.assignment = 'deliver pixel'
    else if (i === 4) villager.assignment = 'build astroprojection'
    else if (i === 5) villager.assignment = 'invoke astroprojection'
    else if (i === 6) villager.assignment = 'build iron storage'
    else if (i === 7) villager.assignment = 'build pixel storage'
  }
}

const mineToStorageMapping = {
  mine: 'ironPit',
  pixelExtractionFacility: 'rainbow',
}

const requirements = {
  mine: 10,
  ironPit: 5,
  pixelExtractionFacility: 2,
  rainbow: 1,
  astroprojectionFacility: 1,
}

function build(type, villager, ...args) {
  if (!villager.building) villager.build(type, ...args)
}

function deliver(mineType, villager, structures, villagers) {
  if (!villager.delivering) {
    const mines = filterProperties(structures, { type: mineType })
    const storages = filterProperties(structures, { type: mineToStorageMapping[mineType] })
    if (storages.length !== 0 && mines.length !== 0) {
      let storageNumbers = storages.reduce((acc, val, i) => ({ ...acc, [i]: 0 }), {})
      let mineNumbers = mines.reduce((acc, val, i) => ({ ...acc, [i]: 0 }), {})
      for (let villager of villagers) {
        if (villager.delivering) {
          mineNumbers[mines.indexOf(villager.deliveringFrom)]++
          storageNumbers[storages.indexOf(villager.deliveringTo)]++
        }
      }
      storageNumbers = Object.keys(storageNumbers).sort(
        (a, b) => storageNumbers[a] - storageNumbers[b],
      )
      mineNumbers = Object.keys(mineNumbers).sort((a, b) => mineNumbers[a] - mineNumbers[b])

      villager.deliverFor(mines[mineNumbers[0]], storages[storageNumbers[0]])
    }
  }
}

function main({ villagers, structures, turn }) {
  for (let villager of villagers) {
    switch (villager.assignment) {
      case 'build mine': {
        if (filterProperties(structures, { type: 'mine' }).length <= 10) build('mine', villager)
        break
      }
      case 'build iron storage': {
        build('ironPit', villager)
        break
      }
      case 'deliver iron': {
        deliver('mine', villager, structures, villagers)
        break
      }
      case 'build pixel mine': {
        build('pixelExtractionFacility', villager)
        break
      }
      case 'build pixel storage': {
        build('rainbow', villager)
        break
      }
      case 'deliver pixel': {
        deliver('pixelExtractionFacility', villager, structures, villagers)
        break
      }
      case 'build astroprojection': {
        build('astroprojectionFacility', villager, 'text("Hello, world!")')
        break
      }
      case 'invoke astroprojection': {
        const astroprojectionFacilities = filterProperties(structures, {
          type: 'astroprojectionFacility',
        })
        if (astroprojectionFacilities[0]) {
          villager.invoke(astroprojectionFacilities[0])
        }
      }
    }
  }
}
`

/* eslint-disable-next-line */
eval(program + ';init(data)')

const DEBUG = true

const images = {}
for (let kind of [
  'villager',
  'mine',
  'ironPit',
  'pixelExtractionFacility',
  'rainbow',
  'astroprojectionFacility',
  'iron',
  'pixel',
]) {
  const image = new Image()
  images[kind] = image
  image.src = `assets/${kind}.png`
}

function mainLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  /* eslint-disable-next-line */
  eval(program + ';main(data)')
  for (let villager of data.villagers) {
    villager.update()
  }
  for (let structure of data.structures) {
    structure.update()
  }
  data.turn++
  if (DEBUG) {
    for (let [i, image] of [
      'villager',
      'mine',
      'ironPit',
      'pixelExtractionFacility',
      'rainbow',
      'astroprojectionFacility',
      'iron',
      'pixel',
    ].entries()) {
      let count = 0
      switch (image) {
        case 'villager': {
          count = data.villagers.length
          break
        }
        case 'mine': {
          count = filterProperties(data.structures, { type: 'mine' }).length
          break
        }
        case 'ironPit': {
          count = filterProperties(data.structures, { type: 'ironPit' }).length
          break
        }
        case 'pixelExtractionFacility': {
          count = filterProperties(data.structures, { type: 'pixelExtractionFacilityironPit' })
            .length
          break
        }
        case 'rainbow': {
          count = filterProperties(data.structures, { type: 'rainbow' }).length
          break
        }
        case 'astroprojectionFacility': {
          count = filterProperties(data.structures, { type: 'astroprojectionFacilityrainbow' })
            .length
          break
        }
        case 'iron': {
          count = totalIron()
          break
        }
        case 'pixel': {
          count = totalPixels()
          break
        }
      }
      for (let x = 0; x < count; x++) {
        debugCtx.drawImage(images[image], x * 40, i * 100, 100, 100)
        // console.log(imageges[image])
      }
    }
  }
  setTimeout(mainLoop, 0)
}

mainLoop()
