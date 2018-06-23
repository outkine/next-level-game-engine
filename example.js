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
  // console.log(villagers.map((villager) => villager.assignment))
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
    // if (villager.idle) {
    //   build('mine', villager)
    // }
  }
}
